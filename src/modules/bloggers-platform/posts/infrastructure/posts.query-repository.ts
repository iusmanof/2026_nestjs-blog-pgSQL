import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { PostsQueryParamsDto } from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { PostsEntityWithBlogRowAndLikesRaw } from '@modules/bloggers-platform/posts/api/dto/post-view.dto';

@Injectable()
class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async countPosts(): Promise<number> {
    const queryPosts = `SELECT COUNT(*) FROM "Posts"`;
    const result: [{ count: number }] = await this.dataSource.query(queryPosts);
    return result[0].count;
  }

  async getAll(query: PostsQueryParamsDto, userId?: string) {
    const totalCount = Number(await this.countPosts());
    const limit = query.pageSize;
    const offset = query.calculateSkip();
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const userIdParam = userId ?? null;

    const items: PostsEntityWithBlogRowAndLikesRaw[] = await this.dataSource.query(
      `SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."createdAt", b."name" as "blogName",
                (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p."id" AND "status" = 'Like') as "likesCount",
                (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p."id" AND "status" = 'Dislike') as "dislikesCount",
                (SELECT "status" FROM "PostLikes" WHERE "postId" = p."id" AND "userId" = $3 LIMIT 1) as "myStatus",
                (SELECT json_agg(l)  FROM ( SELECT pl."userId", u."login", pl."addedAt" FROM "PostLikes" pl
                                   JOIN "Users" u ON u."id" = pl."userId"
                                   WHERE pl."postId" = p."id"
                                   AND pl."status" = 'Like'
                                   ORDER BY pl."addedAt" DESC
                                   LIMIT 3) 
                               l) AS "newestLikes"
              FROM "Posts" p
              JOIN "Blogs" b ON b."id" = p."blogId"
              ORDER BY p."${sortBy}" ${sortDirection}
              LIMIT $1 OFFSET $2;`,
      [limit, offset, userIdParam],
    );

    return {
      totalCount,
      items,
    };
  }

  async findByIdWithRequestingUser(
    postId: string,
    userId?: string,
  ): Promise<PostsEntity | null> {
    const userIdParam = userId ?? null;
    const item: PostsEntityWithBlogRowAndLikesRaw[] = await this.dataSource.query(
      `SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."createdAt", b."name" as "blogName",
      COALESCE(SUM(CASE WHEN pl."status" = 'Like' THEN 1 ELSE 0 END), 0) as "likesCount",
      COALESCE(SUM(CASE WHEN pl."status" = 'Dislike' THEN 1 ELSE 0 END), 0) as "dislikesCount",
      MAX(CASE WHEN pl."userId" = $2 THEN pl."status" END) as "myStatus",
      (
        SELECT json_agg(l)
        FROM (
          SELECT pl2."userId", u."login", pl2."addedAt"
          FROM "PostLikes" pl2
          JOIN "Users" u ON u."id" = pl2."userId"
          WHERE pl2."postId" = p."id" AND pl2."status" = 'Like'
          ORDER BY pl2."addedAt" DESC
          LIMIT 3
        ) l
      ) as "newestLikes"
        FROM "Posts" p
        JOIN "Blogs" b ON b."id" = p."blogId"
        LEFT JOIN "PostLikes" pl ON pl."postId" = p."id"
        WHERE p."id" = $1
        GROUP BY p."id", b."name";
        `,
      [postId, userIdParam],
    );

    return item[0] ?? null;
  }

  async countPostsByBlogId(blogId: string): Promise<number> {
    const queryPosts = `SELECT COUNT(*) FROM "Posts" WHERE "blogId" = $1`;
    const result: [{ count: number }] = await this.dataSource.query(queryPosts, [blogId]);
    return result[0].count;
  }

  async getPostsForBlog(blogId: string, query: PostsQueryParamsDto, userId?: string) {
    const totalCount = Number(await this.countPostsByBlogId(blogId));
    const limit = query.pageSize;
    const offset = query.calculateSkip();
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const userIdParam = userId ?? null;

    const items: PostsEntityWithBlogRowAndLikesRaw[] = await this.dataSource.query(
      `SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."createdAt", b."name" as "blogName",
                (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p."id" AND "status" = 'Like') as "likesCount",
                (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p."id" AND "status" = 'Dislike') as "dislikesCount",
                (SELECT "status" FROM "PostLikes" WHERE "postId" = p."id" AND "userId" = $4 LIMIT 1) as "myStatus",
                (SELECT json_agg(l)  FROM ( SELECT pl."userId", u."login", pl."addedAt" FROM "PostLikes" pl
                                   JOIN "Users" u ON u."id" = pl."userId"
                                   WHERE pl."postId" = p."id"
                                   AND pl."status" = 'Like'
                                   ORDER BY pl."addedAt" DESC
                                   LIMIT 3) 
                               l) AS "newestLikes"
              FROM "Posts" p
              JOIN "Blogs" b ON b."id" = p."blogId"
              WHERE p."blogId" = $3
              ORDER BY p."${sortBy}" ${sortDirection}
              LIMIT $1 OFFSET $2;`,
      [limit, offset, blogId, userIdParam],
    );

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
