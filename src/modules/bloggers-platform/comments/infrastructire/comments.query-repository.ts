import { Injectable } from '@nestjs/common';
import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';
import { CommentLikesEntity } from '@modules/bloggers-platform/comments/domain/comment-like.entity';

@Injectable()
class CommentsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async findById(commentId: string): Promise<CommentsEntity> {
    const query = `SELECT c.id, c.content, c."createdAt",c."likesCount", c."dislikesCount", c."userId", u.login AS "userLogin"
                   FROM "Comments" c LEFT JOIN "Users" u ON u.id = c."userId" WHERE c.id = $1`;

    const result: CommentsEntity[] = await this.dataSource.query(query, [commentId]);
    return result[0] ?? null;
  }

  async getCommentByPostId(postId: string, userId: string, query: CommentsQueryParamsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const sortBy = query.sortBy || 'createdAt';
      const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
      const limit = query.pageSize;
      const offset = query.calculateSkip();

      const countResult = (await queryRunner.query(
        `SELECT COUNT(*) FROM "Comments" WHERE "postId" = $1`,
        [postId],
      )) as { count: string }[];
      const totalCount = Number(countResult[0].count);

      const items = (await queryRunner.query(
        `SELECT c.*, u.login AS "userLogin"
         FROM "Comments" c
                JOIN "Users" u ON u.id = c."userId"
         WHERE c."postId" = $1
         ORDER BY "${sortBy}" ${sortDirection}
         LIMIT $2 OFFSET $3`,
        [postId, limit, offset],
      )) as CommentsEntity[];

      const commentIds = items.map((c) => c.id);

      const likeStatuses =
        userId && commentIds.length
          ? ((await queryRunner.query(
              `SELECT "commentId", "status"
             FROM "CommentLikes"
             WHERE "userId" = $1
             AND "commentId" = ANY($2)`,
              [userId, commentIds],
            )) as {
              commentId: string;
              status: LikeStatus;
            }[])
          : [];

      const statusMap = new Map<string, LikeStatus>();

      likeStatuses.forEach((l) => {
        statusMap.set(l.commentId, l.status);
      });

      return { items, totalCount, statusMap };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOrNotFail(commentId: string): Promise<CommentsEntity[]> {
    const query = `SELECT * FROM "Comments" WHERE "id" = $1`;
    return await this.dataSource.query(query, [commentId]);
  }

  async findStatusByUserId(commentId: string, userId?: string): Promise<LikeStatus> {
    if (!userId) {
      return 'None';
    }

    const query = `SELECT status FROM "CommentLikes" WHERE "commentId" = $1 AND "userId" = $2 LIMIT 1`;

    const result: CommentLikesEntity[] = await this.dataSource.query(query, [commentId, userId]);
    return result[0]?.status ?? 'None';
  }
}

export default CommentsQueryRepository;
