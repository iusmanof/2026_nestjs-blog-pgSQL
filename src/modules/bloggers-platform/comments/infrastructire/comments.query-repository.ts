import { Injectable } from '@nestjs/common';
import { CommentsQueryParamsDto, CommentsSortBy } from '../api/dto/comments-query-params.dto';
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

  async findById(commentId: string): Promise<CommentsEntity | null> {
    return await this.dataSource
      .getRepository(CommentsEntity)
      .findOne({ where: { id: commentId } });
  }

  async getCommentByPostId(postId: string, userId: string, query: CommentsQueryParamsDto) {
    const sortBy = query.sortBy || CommentsSortBy.CreatedAt;
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const limit = query.pageSize;
    const offset = query.calculateSkip();

    const qb = this.dataSource
      .getRepository(CommentsEntity)
      .createQueryBuilder('c')
      .where('c.postId = :postId', { postId });

    const totalCount = await qb.getCount();

    const items = await qb
      .orderBy(`c.${sortBy}`, sortDirection)
      .limit(limit)
      .offset(offset)
      .getMany();

    const commentIds = items.map((c) => c.id);

    let statusMap = new Map<string, LikeStatus>();

    if (userId && commentIds.length) {
      const likes = await this.dataSource
        .getRepository(CommentLikesEntity)
        .createQueryBuilder('cl')
        .select(['cl.commentId', 'cl.status'])
        .where('cl.userId = :userId', { userId })
        .andWhere('cl.commentId IN (:...commentIds)', { commentIds })
        .getRawMany<{ cl_commentId: string; cl_status: LikeStatus }>();

      statusMap = new Map(likes.map((l) => [l.cl_commentId, l.cl_status]));
    }

    return { items, totalCount, statusMap };
  }

  async findStatusByUserId(commentId: string, userId: string): Promise<LikeStatus> {
    const result: { status?: LikeStatus } | undefined = await this.dataSource
      .getRepository(CommentLikesEntity)
      .createQueryBuilder('cl')
      .select('cl.status', 'status')
      .where('cl.commentId = :commentId', { commentId })
      .andWhere('cl.userId = :userId', { userId })
      .getRawOne();

    return result?.status ?? 'None';
  }
}

export default CommentsQueryRepository;
