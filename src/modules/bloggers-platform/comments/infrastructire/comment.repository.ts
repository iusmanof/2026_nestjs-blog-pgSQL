import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { UpdateCommentDto } from '@modules/bloggers-platform/comments/api/dto/update-comment.dto';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async create(postId: string, userId: string, content: string): Promise<CommentsEntity> {
    const query = `INSERT INTO "Comments"  ("content", "postId", "userId", "likesCount", "dislikesCount")
      VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

    const values = [content, postId, userId, 0, 0];

    const result: CommentsEntity[] = await this.dataSource.query(query, values);

    return result[0];
  }

  async delete(commentId: string): Promise<void> {
    const query = `DELETE FROM "Comments" WHERE "id" = $1`;
    const values = [commentId];
    await this.dataSource.query(query, values);
  }

  async update(commentId: string, dto: UpdateCommentDto): Promise<void> {
    const query = `UPDATE "Comments" SET "content" = $2 WHERE "id" = $1 RETURNING *`;
    const values = [commentId, dto.content];
    return await this.dataSource.query(query, values);
  }

  async updateLikeStatus(commentId: string, userId: string, status: LikeStatus): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(
        `INSERT INTO "CommentLikes" ("commentId", "userId", "status") 
     VALUES ($1, $2, $3)
     ON CONFLICT ("commentId", "userId") 
     DO UPDATE SET "status" = EXCLUDED."status"`,
        [commentId, userId, status],
      );

      await queryRunner.query(
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

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      // throw e;
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  async deleteAll() {
    const query = `DELETE FROM "Comments"`;
    await this.dataSource.query(query);
  }

  async deleteAllCommentsLikes() {
    const query = `DELETE FROM "CommentLikes"`;
    await this.dataSource.query(query);
  }
}

export default CommentsRepository;
