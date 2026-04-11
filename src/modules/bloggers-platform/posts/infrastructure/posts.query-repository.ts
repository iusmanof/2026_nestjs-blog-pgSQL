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
import { PostsQueryMapper } from '@modules/bloggers-platform/blogs/application/queries/post-query-mapper';

@Injectable()
class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: PostsQueryParamsDto, userId?: string) {
    const posts = await this.getBasePosts(query);

    if (posts.length === 0) {
      return {
        totalCount: 0,
        items: [],
      };
    }

    const postIds = posts.map((p) => p.id);

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
    const posts = await this.getBasePostsForBlog(blogId, query);

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

  // base queries

  private async getBasePosts(query: PostsQueryParamsDto) {
    const sortMap: Record<string, string> = {
      createdAt: 'p.createdAt',
      title: 'p.title',
      blogName: 'b.name',
    };

    const orderBy = sortMap[query.sortBy] || 'p.createdAt';
    const direction = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    return this.dataSource
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
      .innerJoin('Blogs', 'b', 'b.id = p.blogId')
      .orderBy(orderBy, direction)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();
  }

  private async getBasePostsForBlog(blogId: string, query: PostsQueryParamsDto) {
    const sortMap: Record<string, string> = {
      createdAt: 'p.createdAt',
      title: 'p.title',
    };

    const orderBy = sortMap[query.sortBy] || 'p.createdAt';
    const direction = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    return this.dataSource
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
      .innerJoin('Blogs', 'b', 'b.id = p.blogId')
      .where('p.blogId = :blogId', { blogId })
      .orderBy(orderBy, direction)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getRawMany();
  }

  private async getPostsCount(blogId?: string) {
    const qb = this.dataSource.createQueryBuilder().from('Posts', 'p');

    if (blogId) {
      qb.where('p.blogId = :blogId', { blogId });
    }

    return qb.getCount();
  }

  private async getReactions(postIds: string[]) {
    return this.dataSource
      .createQueryBuilder()
      .select('pl.postId', 'postId')
      .addSelect(`COUNT(*) FILTER (WHERE pl.status = 'Like')`, 'likesCount')
      .addSelect(`COUNT(*) FILTER (WHERE pl.status = 'Dislike')`, 'dislikesCount')
      .from('PostLikes', 'pl')
      .where('pl.postId IN (:...postIds)', { postIds })
      .groupBy('pl.postId')
      .getRawMany();
  }

  private async getMyStatuses(postIds: string[], userId?: string) {
    if (!userId) return [];

    return this.dataSource
      .createQueryBuilder()
      .select(['pl.postId as "postId"', 'pl.status as status'])
      .from('PostLikes', 'pl')
      .where('pl.postId IN (:...postIds)', { postIds })
      .andWhere('pl.userId = :userId', { userId })
      .getRawMany();
  }

  private async getNewestLikes(postIds: string[]) {
    return this.dataSource.query(
      `
      SELECT *
      FROM (
        SELECT 
          pl."postId",
          pl."userId",
          u.login,
          pl."addedAt",
          ROW_NUMBER() OVER (
            PARTITION BY pl."postId"
            ORDER BY pl."addedAt" DESC
          ) as rn
        FROM "PostLikes" pl
        JOIN "Users" u ON u.id = pl."userId"
        WHERE pl."postId" = ANY($1)
          AND pl.status = 'Like'
      ) t
      WHERE t.rn <= 3
      `,
      [postIds],
    );
  }

  private mergePosts(posts: any[], reactions: any[], myStatuses: any[], newestLikes: any[]) {
    const reactionsMap = new Map(reactions.map((r) => [r.postId, r]));

    const myStatusMap = new Map(myStatuses.map((m) => [m.postId, m.status]));

    const newestLikesMap = new Map<string, any[]>();

    for (const like of newestLikes) {
      if (!newestLikesMap.has(like.postId)) {
        newestLikesMap.set(like.postId, []);
      }

      newestLikesMap.get(like.postId)!.push({
        userId: like.userId,
        login: like.login,
        addedAt: like.addedAt,
      });
    }

    return posts.map((post) => ({
      ...post,
      likesCount: Number(reactionsMap.get(post.id)?.likesCount ?? 0),
      dislikesCount: Number(reactionsMap.get(post.id)?.dislikesCount ?? 0),
      myStatus: myStatusMap.get(post.id) ?? 'None',
      newestLikes: newestLikesMap.get(post.id) ?? [],
    }));
  }

  // TODO REFACTORING

  async findByIdWithRequestingUser(postId: string, userId?: string): Promise<PostViewDto | null> {
    const post = await this.dataSource
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
      .innerJoin('Blogs', 'b', 'b.id = p.blogId')
      .where('p.id = :postId', { postId })
      .getRawOne();

    if (!post) return null;

    const reactions = await this.dataSource
      .createQueryBuilder()
      .select('pl.postId', 'postId')
      .addSelect(`COUNT(*) FILTER (WHERE pl.status = 'Like')`, 'likesCount')
      .addSelect(`COUNT(*) FILTER (WHERE pl.status = 'Dislike')`, 'dislikesCount')
      .from('PostLikes', 'pl')
      .where('pl.postId = :postId', { postId })
      .groupBy('pl.postId')
      .getRawOne();

    const myStatus = userId
      ? await this.dataSource
          .createQueryBuilder()
          .select('pl.status', 'status')
          .from('PostLikes', 'pl')
          .where('pl.postId = :postId', { postId })
          .andWhere('pl.userId = :userId', { userId })
          .getRawOne()
      : null;

    const newestLikesRaw = await this.dataSource
      .createQueryBuilder()
      .select(['pl.userId as "userId"', 'u.login as login', 'pl.addedAt as "addedAt"'])
      .from('PostLikes', 'pl')
      .innerJoin('Users', 'u', 'u.id = pl.userId')
      .where('pl.postId = :postId', { postId })
      .andWhere('pl.status = :like', { like: 'Like' })
      .orderBy('pl.addedAt', 'DESC')
      .limit(3)
      .getRawMany();

    return PostsQueryMapper.toViewDto({
      ...post,
      likesCount: Number(reactions?.likesCount ?? 0),
      dislikesCount: Number(reactions?.dislikesCount ?? 0),
      myStatus: myStatus?.status ?? 'None',
      newestLikes: newestLikesRaw.map((l) => ({
        userId: l.userId,
        login: l.login,
        addedAt: l.addedAt,
      })),
    });
  }

  // TODO можно ли так сделать в queryRepository
  async findById(id: string): Promise<PostsEntity | null> {
    return await this.dataSource.getRepository(PostsEntity).findOne({ where: { id: id } });
  }
}

export default PostsQueryRepository;
