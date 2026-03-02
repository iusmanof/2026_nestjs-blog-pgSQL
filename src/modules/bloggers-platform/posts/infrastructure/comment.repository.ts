// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Comment, CommentDocument } from '../domain/comment.entity';
// import type { CommentModelType } from '../domain/comment.entity';
// import { UpdateCommentDto } from '../api/dto/update-comment.dto';
// import { LikeStatus } from '../types/like-status.type';
//
// @Injectable()
// class CommentsRepository {
//   constructor(
//     @InjectModel(Comment.name)
//     private readonly commentModel: CommentModelType,
//   ) {}
//
//   create(postId: string, userId: string, login: string, content: string): CommentDocument {
//     return this.commentModel.createInstance(postId, userId, login, content);
//   }
//
//   async delete(commentId: string): Promise<boolean> {
//     const entity = await this.commentModel.deleteOne({ _id: commentId });
//     return entity.deletedCount === 1;
//   }
//
//   async update(commentId: string, dto: UpdateCommentDto): Promise<boolean> {
//     const entity = await this.commentModel.findById(commentId);
//     if (!entity) return false;
//
//     entity.updateContent(dto.content);
//     await entity.save();
//     return true;
//   }
//
//   async updateLikeStatus(
//     commentId: string,
//     userId: string,
//     likeStatus: LikeStatus,
//   ): Promise<boolean> {
//     const entity = await this.commentModel.findById(commentId);
//     if (!entity) return false;
//
//     entity.updateLikeStatus(userId, likeStatus);
//     // entity.saveInstance(commentModel) { commentModel.save() }
//
//     await entity.save();
//
//     return true;
//   }
//
//   async save(comment: CommentDocument): Promise<void> {
//     await comment.save();
//   }
// }
//
// export default CommentsRepository;
