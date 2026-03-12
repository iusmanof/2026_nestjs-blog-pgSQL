import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { UpdateCommentDto } from '@modules/bloggers-platform/posts/api/dto/update-comment.dto';

@Injectable()
class CommentsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async create(
    postId: string,
    userId: string,
    login: string,
    content: string,
  ): Promise<CommentsEntity> {
    const query = `
      INSERT INTO "Comments" ("content", "postId", "userId", "userLogin", "likesCount", "dislikesCount")
      VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const values = [content, postId, userId, login, 0, 0];

    const result: CommentsEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  async delete(commentId: string): Promise<void> {
    const query = `DELETE FROM "Comments" WHERE "id" = $1`;
    const values = [commentId];
    await this.dataSource.query(query, values);
  }

  async update(commentId: string, dto: UpdateCommentDto): Promise<void> {
    // const entity = await this.commentModel.findById(commentId);
    // if (!entity) return false;
    //
    // entity.updateContent(dto.content);
    // await entity.save();
    // return true;
    const query = `UPDATE "Comments" SET "content" = $2 WHERE "id" = $1 RETURNING *`;
    const values = [commentId, dto.content];
    return await this.dataSource.query(query, values);
  }

  // async updateLikeStatus(
  //   commentId: string,
  //   userId: string,
  //   likeStatus: LikeStatus,
  // ): Promise<boolean> {
  //   const entity = await this.commentModel.findById(commentId);
  //   if (!entity) return false;
  //
  //   entity.updateLikeStatus(userId, likeStatus);
  //   // entity.saveInstance(commentModel) { commentModel.save() }
  //
  //   await entity.save();
  //
  //   return true;
  // }
  //
  // async save(comment: CommentDocument): Promise<void> {
  //   await comment.save();
  // }

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
