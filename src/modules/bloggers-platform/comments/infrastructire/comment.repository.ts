import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';
import { CommentLikesEntity } from '@modules/bloggers-platform/comments/domain/comment-like.entity';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async findById(commentId: string): Promise<CommentsEntity | null> {
    return await this.dataSource
      .getRepository(CommentsEntity)
      .findOne({ where: { id: commentId } });
  }

  async save(comment: CommentsEntity) {
    await this.dataSource.getRepository(CommentsEntity).save(comment);
  }

  async remove(commentId: string): Promise<void> {
    await this.dataSource.getRepository(CommentsEntity).delete({ id: commentId });
  }
  async updateLikeStatus(commentId: string, userId: string, status: LikeStatus): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.upsert(CommentLikesEntity, { commentId, userId, status }, [
        'commentId',
        'userId',
      ]);

      await transactionalEntityManager.query(
        `UPDATE "Comments" c
        SET
          "likesCount" = sub.likes,
          "dislikesCount" = sub.dislikes
        FROM (
          SELECT
            cl."commentId",
            COUNT(*) FILTER (WHERE cl."status" = 'Like') AS likes,
            COUNT(*) FILTER (WHERE cl."status" = 'Dislike') AS dislikes
          FROM "CommentLikes" cl
          WHERE cl."commentId" = $1
          GROUP BY cl."commentId"
        ) sub
        WHERE c.id = sub."commentId"`,
        [commentId],
      );
    });
  }
  async deleteAll() {
    await this.dataSource.createQueryBuilder().delete().from('Comments').execute();
  }
  async deleteAllCommentsLikes() {
    await this.dataSource.createQueryBuilder().delete().from('CommentLikes').execute();
  }
}

export default CommentsRepository;
