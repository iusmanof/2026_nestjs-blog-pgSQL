import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import {
  PostsQueryParamsDto,
  PostsSortBy,
} from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
import { PostViewDto } from '@modules/bloggers-platform/posts/api/dto/post-view.dto';
import { NewestLikeViewDto } from '@modules/bloggers-platform/posts/api/dto/newest-like-view.dto';
import { ReactionRowDto } from '@modules/bloggers-platform/posts/api/dto/reaction-row.dto';
import { StatusRowDto } from '@modules/bloggers-platform/posts/api/dto/status-row.dto';

@Injectable()
class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  // TODO можно ли так сделать в queryRepository
  // не Entity ...  ViewDto или
  // DTO ≠ Entity — не путай, маппинг делай явно.
  // Разделяй DTO и entity. DTO — это «то, что пришло от клиента» или «то, что мы отдаём».
  // Entity — это «то, что хранится в БД». Не инжекть DTO прямо в базу, даже если поля совпадают.
  // Пусть маппинг происходит явно — через сервисы или фабричные методы на entity.
  async findById(id: string): Promise<PostsEntity | null> {
    return await this.dataSource.getRepository(PostsEntity).findOne({ where: { id: id } });
  }

  async getAll(query: PostsQueryParamsDto, userId?: string) {
    const posts = await this.getBasePosts(query);

    if (posts.length === 0) {
      return {
        totalCount: 0,
        items: [],
      };
    }

    const postIds: string[] = posts.map((p) => p.id);

    const [totalCount, reactions, myStatuses, newestLikes] = await Promise.all([
      this.getPostsCount(),
      this.getReactions(postIds),
      this.getMyStatuses(postIds, userId),
      this.getNewestLikes(postIds),
    ]);

    return {
      totalCount,
      items: this.mergePosts(posts, reactions, myStatuses, newestLikes),
    };
  }

  async getPostsForBlog(blogId: string, query: PostsQueryParamsDto, userId?: string) {
    const options = { blogId };
    const posts = await this.getBasePosts(query, options);

    if (posts.length === 0) {
      return {
        totalCount: 0,
        items: [],
      };
    }

    const postIds = posts.map((p) => p.id);

    const [totalCount, reactions, myStatuses, newestLikes] = await Promise.all([
      this.getPostsCount(blogId),
      this.getReactions(postIds),
      this.getMyStatuses(postIds, userId),
      this.getNewestLikes(postIds),
    ]);

    return {
      totalCount,
      items: this.mergePosts(posts, reactions, myStatuses, newestLikes),
    };
  }

  private async getBasePosts(
    query?: PostsQueryParamsDto,
    options?: { blogId?: string; postId?: string },
  ): Promise<PostViewDto[]> {
    const sortMap: Record<string, string> = {
      createdAt: 'p.createdAt',
      title: 'p.title',
      blogName: 'b.name',
    };

    const sortBy = query?.sortBy ?? PostsSortBy.CreatedAt;

    const orderBy = sortMap[sortBy] ?? 'p.createdAt';

    const direction = query?.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const limit = query?.pageSize ?? 10;
    const offset = query?.calculateSkip?.() ?? 0;

    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'p.id as id',
        'p.title as title',
        'p.shortDescription as "shortDescription"',
        'p.content as content',
        'p.blogId as "blogId"',
        'p.createdAt as "createdAt"',
        'b.name as "blogName"',
      ])
      .from('Posts', 'p')
      .innerJoin('Blogs', 'b', 'b.id = p.blogId');

    if (options?.blogId) {
      qb.andWhere('p.blogId = :blogId', { blogId: options.blogId });
    }

    if (options?.postId) {
      qb.andWhere('p.id = :postId', { postId: options.postId });
    }

    return await qb.orderBy(orderBy, direction).limit(limit).offset(offset).getRawMany();
  }

  private async getPostsCount(blogId?: string): Promise<number> {
    const qb = this.dataSource.getRepository(PostsEntity).createQueryBuilder('p');

    if (blogId) {
      qb.where('p.blogId = :blogId', { blogId });
    }

    return qb.getCount();
  }

  private async getReactions(postIds: string[]): Promise<ReactionRowDto[]> {
    if (!postIds.length) return [];

    return this.dataSource
      .createQueryBuilder()
      .select('pl.postId', 'postId')
      .addSelect(`SUM(CASE WHEN pl.status = 'Like' THEN 1 ELSE 0 END)`, 'likesCount')
      .addSelect(`SUM(CASE WHEN pl.status = 'Dislike' THEN 1 ELSE 0 END)`, 'dislikesCount')
      .from('PostLikes', 'pl')
      .where('pl.postId IN (:...postIds)', { postIds })
      .groupBy('pl.postId')
      .getRawMany();
  }

  private async getMyStatuses(postIds: string[], userId?: string): Promise<StatusRowDto[]> {
    if (!userId) return [];

    return this.dataSource
      .createQueryBuilder()
      .select(['pl.postId as "postId"', 'pl.status as status'])
      .from('PostLikes', 'pl')
      .where('pl.postId IN (:...postIds)', { postIds })
      .andWhere('pl.userId = :userId', { userId })
      .getRawMany();
  }

  private async getNewestLikes(postIds: string[]): Promise<NewestLikeViewDto[]> {
    if (!postIds.length) return [];

    return this.dataSource.query(
      `
          SELECT pl."postId", pl."userId", u.login, pl."addedAt"
          FROM "PostLikes" pl
                   JOIN "Users" u ON u.id = pl."userId"
          WHERE pl."postId" = ANY($1)
            AND pl."status" = 'Like'
            AND (
                    SELECT COUNT(*)
                    FROM "PostLikes" pl2
                    WHERE pl2."postId" = pl."postId"
                      AND pl2."status" = 'Like'
                      AND pl2."addedAt" > pl."addedAt"
                ) < 3
          ORDER BY pl."postId", pl."addedAt" DESC
      `,
      [postIds],
    );
  }

  private mergePosts(
    posts: PostViewDto[],
    reactions: ReactionRowDto[],
    myStatuses: StatusRowDto[],
    newestLikes: NewestLikeViewDto[],
  ): PostViewDto[] {
    const reactionsMap = new Map(reactions.map((r) => [r.postId, r]));

    const myStatusMap = new Map(myStatuses.map((m) => [m.postId, m.status]));

    const newestLikesMap = new Map<string, any[]>();

    for (const like of newestLikes) {
      const arr = newestLikesMap.get(like.postId) ?? [];

      if (arr.length < 3) {
        arr.push({
          userId: like.userId,
          login: like.login,
          addedAt: like.addedAt,
        });

        newestLikesMap.set(like.postId, arr);
      }
    }

    return posts.map((post) => ({
      ...post,
      extendedLikesInfo: {
        likesCount: Number(reactionsMap.get(post.id)?.likesCount ?? 0),
        dislikesCount: Number(reactionsMap.get(post.id)?.dislikesCount ?? 0),
        myStatus: myStatusMap.get(post.id) ?? 'None',
        newestLikes: newestLikesMap.get(post.id) ?? [],
      },
    }));
  }

  async findByIdWithRequestingUser(postId: string, userId?: string): Promise<PostViewDto | null> {
    const posts = await this.getBasePosts({} as PostsQueryParamsDto, { postId });

    if (!posts.length) return null;

    const [reactions, myStatuses, newestLikes] = await Promise.all([
      this.getReactions([postId]),
      this.getMyStatuses([postId], userId),
      this.getNewestLikes([postId]),
    ]);

    const merged = this.mergePosts(posts, reactions, myStatuses, newestLikes)[0];

    return PostViewDto.mapToView(merged);
  }
}

export default PostsQueryRepository;
