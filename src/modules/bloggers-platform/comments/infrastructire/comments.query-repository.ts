import { Injectable } from '@nestjs/common';
import { CommentsQueryParamsDto } from '../../posts/api/dto/comments-query-params.dto';
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
    const query = `SELECT * FROM "Comments" WHERE "id" = $1`;
    const values = [commentId];
    const result: CommentsEntity[] = await this.dataSource.query(query, values);
    return result[0] ?? null;
  }

  async getCommentByPostId(postId: string, query: CommentsQueryParamsDto) {
    const countQuery = `
    SELECT COUNT(*) 
    FROM "Comments"
    WHERE "postId" = $1
  `;

    const countResult: number = await this.dataSource.query(countQuery, [postId]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalCount = Number(countResult[0].count);

    const allowedSortFields = ['createdAt', 'content', 'id'];
    const sortField = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'createdAt';

    const sortOrder = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const limit = query.pageSize;
    const offset = query.calculateSkip();

    const itemsQuery = `
    SELECT *
    FROM "Comments"
    WHERE "postId" = $1
    ORDER BY "${sortField}" ${sortOrder}
    LIMIT $2
    OFFSET $3
  `;

    const items: CommentsEntity[] = await this.dataSource.query(itemsQuery, [
      postId,
      limit,
      offset,
    ]);

    return { items, totalCount };
  }

  async findStatusByUserId(commentId: string, userId?: string): Promise<LikeStatus> {
    if (!userId) {
      return 'None';
    }

    const query = `
    SELECT status 
    FROM "CommentLikesEntity"
    WHERE "commentId" = $1 AND "userId" = $2
    LIMIT 1
  `;

    const result: CommentLikesEntity[] = await this.dataSource.query(query, [commentId, userId]);

    return result[0]?.status ?? 'None';
  }
}

export default CommentsQueryRepository;
