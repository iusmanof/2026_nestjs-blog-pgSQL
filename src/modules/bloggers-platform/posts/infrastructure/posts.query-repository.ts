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

  async getAll(query: PostsQueryParamsDto, userId?: string) {
    const { sortBy = 'createdAt', sortDirection, pageSize } = query;

    const offset = query.calculateSkip();

    // const safeSortDirection = sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const sortFieldMap: Record<string, string> = {
      id: 'p."id"',
      title: 'p."title"',
      shortDescription: 'p."shortDescription"',
      content: 'p."content"',
      blogId: 'p."blogId"',
      createdAt: 'p."createdAt"',
      blogName: 'b."name"',
    };

    // const safeSortField = sortFieldMap[sortBy] ?? sortFieldMap.createdAt;

    const [{ count }]: { count: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) FROM "Posts"`,
    );

    const totalCount = Number(count);

    const items: PostsEntityWithBlogRowAndLikesRaw[] = await this.dataSource.query(
      `
          SELECT
              p."id",
              p."title",
              p."shortDescription",
              p."content",
              p."blogId",
              p."createdAt",
              b."name" as "blogName",

              (
                  SELECT COUNT(*)
                  FROM "PostLikes"
                  WHERE "postId" = p."id"
                    AND "status" = 'Like'
              )::int as "likesCount",

              (
                  SELECT COUNT(*)
                  FROM "PostLikes"
                  WHERE "postId" = p."id"
                    AND "status" = 'Dislike'
              )::int as "dislikesCount",

              COALESCE(
                      (
                          SELECT "status"
                          FROM "PostLikes"
                          WHERE "postId" = p."id"
                            AND "userId" = $3
                      LIMIT 1
                  ),
        'None'
    ) as "myStatus",

              COALESCE(nl."newestLikes", '[]') as "newestLikes"

          FROM "Posts" p

                   JOIN "Blogs" b
                        ON b."id" = p."blogId"

                   LEFT JOIN LATERAL (
              SELECT json_agg(
                             json_build_object(
                                     'userId', pl."userId",
                                     'login', u."login",
                                     'addedAt', pl."addedAt"
                             )
                                 ORDER BY pl."addedAt" DESC
                     ) as "newestLikes"
              FROM (
                       SELECT *
                       FROM "PostLikes"
                       WHERE "postId" = p."id"
                         AND "status" = 'Like'
                       ORDER BY "addedAt" DESC
                           LIMIT 3
                   ) pl
                       JOIN "Users" u
                            ON u."id" = pl."userId"
                  ) nl ON TRUE

          ORDER BY p."createdAt" DESC
              LIMIT $1
          OFFSET $2
            `,
      [pageSize, offset, userId ?? null],
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
        b."name" AS "blogName",

        -- считаем лайки
        COALESCE(
          (SELECT COUNT(*) FROM "PostLikes" pl
           WHERE pl."postId" = p."id"
             AND pl."status" = 'Like'), 0
        ) AS "likesCount",

        -- считаем дизлайки
        COALESCE(
          (SELECT COUNT(*) FROM "PostLikes" pl
           WHERE pl."postId" = p."id"
             AND pl."status" = 'Dislike'), 0
        ) AS "dislikesCount",

        -- статус текущего пользователя
        COALESCE(
          (SELECT pl."status"
           FROM "PostLikes" pl
           WHERE pl."postId" = p."id"
             AND pl."userId" = $2), 'None'
        ) AS "myStatus",

        -- три последних лайка
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'addedAt', pl_sub."addedAt",
              'userId', pl_sub."userId",
              'login', pl_sub."login"
                            ) ORDER BY pl_sub."addedAt" DESC)
            FROM (
                   SELECT pl."addedAt", pl."userId", u."login"
                   FROM "PostLikes" pl
                          JOIN "Users" u ON u."id" = pl."userId"
                   WHERE pl."postId" = p."id"
                     AND pl."status" = 'Like'
                   ORDER BY pl."addedAt" DESC
                     LIMIT 3
                 ) AS pl_sub
          ), '[]'::json
        ) AS "newestLikes"

      FROM "Posts" p
             JOIN "Blogs" b ON b."id" = p."blogId"
      WHERE p."id" = $1;
     
     `;
    const values = [postId, currentUserId ?? null];

    const result: PostsEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  async getPostsForBlog(blogId: string, query: PostsQueryParamsDto, currentUserId?: string) {
    const { pageSize } = query;
    const offset = query.calculateSkip();

    // Общее количество постов
    const countQuery = `
            SELECT COUNT(*)::int
            FROM "Posts"
            WHERE "blogId" = $1
        `;
    const [{ count: totalCount }]: [{ count: number }] = await this.dataSource.query(countQuery, [
      blogId,
    ]);

    const items = await this.dataSource.query(
      `
                SELECT
                    p."id",
                    p."title",
                    p."shortDescription",
                    p."content",
                    p."blogId",
                    p."createdAt",
                    b."name" AS "blogName",

                    -- Кол-во лайков
                    (
                        SELECT COUNT(*)
                        FROM "PostLikes"
                        WHERE "postId" = p."id"
                          AND "status" = 'Like'
                    )::int AS "likesCount",

      -- Кол-во дизлайков
                    (
                        SELECT COUNT(*)
                        FROM "PostLikes"
                        WHERE "postId" = p."id"
                          AND "status" = 'Dislike'
                    )::int AS "dislikesCount",

      -- Статус текущего пользователя
                    COALESCE(
                            (
                                SELECT "status"
                                FROM "PostLikes"
                                WHERE "postId" = p."id"
                                  AND ($4::uuid IS NULL OR "userId" = $4::uuid)
                            LIMIT 1
                        ),
        'None'
      ) AS "myStatus",

                    -- Последние 3 лайка
                    COALESCE(nl."newestLikes", '[]') AS "newestLikes"

                FROM "Posts" p
                         JOIN "Blogs" b ON b."id" = p."blogId"

                         LEFT JOIN LATERAL (
                    SELECT json_agg(
                                   json_build_object(
                                           'userId', pl."userId",
                                           'login', u."login",
                                           'addedAt', pl."addedAt"
                                   ) ORDER BY pl."addedAt" DESC
                           ) AS "newestLikes"
                    FROM (
                             SELECT *
                             FROM "PostLikes"
                             WHERE "postId" = p."id"
                               AND "status" = 'Like'
                             ORDER BY "addedAt" DESC
                                 LIMIT 3
                         ) pl
                             JOIN "Users" u ON u."id" = pl."userId"
                        ) nl ON TRUE

                WHERE p."blogId" = $3
                ORDER BY p."createdAt" DESC
                    LIMIT $1
                OFFSET $2
            `,
      [pageSize, offset, blogId, currentUserId ?? null],
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
