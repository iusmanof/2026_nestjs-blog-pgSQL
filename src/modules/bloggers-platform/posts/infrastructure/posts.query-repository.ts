import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { PostsQueryParamsDto } from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
import BlogQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

@Injectable()
class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: PostsQueryParamsDto) {
    const { sortBy = 'createdAt', sortDirection, pageSize } = query;

    const offset = query.calculateSkip();

    const safeSortDirection = sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const sortFieldMap: Record<string, string> = {
      id: 'p."id"',
      title: 'p."title"',
      shortDescription: 'p."shortDescription"',
      content: 'p."content"',
      blogId: 'p."blogId"',
      createdAt: 'p."createdAt"',
      blogName: 'b."name"',
    };

    const safeSortField = sortFieldMap[sortBy] ?? sortFieldMap.createdAt;

    const [{ count }]: { count: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) FROM "Posts"`,
    );

    const totalCount = Number(count);

    const items: PostsEntity[] = await this.dataSource.query(
      `
        SELECT
          p."id",
          p."title",
          p."shortDescription",
          p."content",
          p."blogId",
          p."createdAt",
          b."name" as "blogName"
        FROM "Posts" p
        JOIN "Blogs" b ON b."id" = p."blogId"
        ORDER BY ${safeSortField} ${safeSortDirection}
        LIMIT $1
        OFFSET $2
      `,
      [pageSize, offset],
    );

    return {
      totalCount,
      items,
    };
  }

  async findByIdWithRequestingUser(
    postId: string,
    currentUserId?: string,
  ): Promise<PostsEntity | null> {
    const query = `
    SELECT
       p."id",
       p."title",
       p."shortDescription",
       p."content",
       p."blogId",
       p."createdAt",
       b."name" as "blogName"
     FROM "Posts" p
     JOIN "Blogs" b ON b."id" = p."blogId"
    WHERE p."id" = $1`;
    const values = [postId];

    if (currentUserId) {
      console.log(currentUserId);
    }

    const result: PostsEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }
  async getPostsForBlog(blogId: string, query: PostsQueryParamsDto, currentUserId?: string) {
    const countQuery = `
            SELECT COUNT(*)::int
            FROM "Posts"
            WHERE "blogId" = $1
        `;
    const [{ count: totalCount }]: [{ count: number }] = await this.dataSource.query(countQuery, [
      blogId,
    ]);

    const itemsQuery = `
            SELECT
                p.*,
                b."name" AS "blogName",

                (SELECT COUNT(*) FROM "PostLikes"
                 WHERE "postId" = p.id AND status = 'Like') AS "likesCount",

                (SELECT COUNT(*) FROM "PostLikes"
                 WHERE "postId" = p.id AND status = 'Dislike') AS "dislikesCount",

                (SELECT status FROM "PostLikes"
                 WHERE "postId" = p.id AND "userId" = $4
                    LIMIT 1) AS "myStatus"

            FROM "Posts" p
                LEFT JOIN "Blogs" b ON b.id = p."blogId"

            WHERE p."blogId" = $1
            ORDER BY "${query.sortBy}" ${query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC'}
                LIMIT $2 OFFSET $3
        `;

    const itemsRaw = await this.dataSource.query(itemsQuery, [
      blogId,
      query.pageSize,
      query.calculateSkip(),
      currentUserId ?? null,
    ]);

    const items = itemsRaw.map((post) => ({
      ...post,
      extendedLikesInfo: {
        likesCount: Number(post.likesCount) || 0,
        dislikesCount: Number(post.dislikesCount) || 0,
        myStatus: post.myStatus ?? 'None', // обработка null здесь
        newestLikes: [],
      },
    }));

    return {
      totalCount,
      items,
    };
  }

  async findOrNotFoundFail(id: string): Promise<PostsEntity | null> {
    const query = `SELECT * FROM "Posts" WHERE id = $1`;
    const values = [id];
    const entity: PostsEntity[] = await this.dataSource.query(query, values);
    if (!entity.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
        extensions: [new Extension('Post with given id does not exist', 'id')],
      });
    }
    return entity[0];
  }
}

export default PostsQueryRepository;
