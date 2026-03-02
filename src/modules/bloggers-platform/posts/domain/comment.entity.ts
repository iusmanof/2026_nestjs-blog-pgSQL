// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { LikeStatus } from '../types/like-status.type';
//
// @Schema({ timestamps: { createdAt: true, updatedAt: false } })
// export class Comment {
//   @Prop({ type: String, required: true })
//   content: string;
//
//   @Prop({ type: String, required: true })
//   postId: string;
//
//   @Prop({ type: String, required: true })
//   userId: string;
//
//   @Prop({ type: String, required: true })
//   userLogin: string;
//
//   @Prop({
//     _id: false,
//     default: {
//       likesCount: 0,
//       dislikesCount: 0,
//       myStatus: 'None',
//     },
//     type: {
//       likesCount: { type: Number },
//       dislikesCount: { type: Number },
//       myStatus: { type: String },
//     },
//   })
//   likesInfo: {
//     likesCount: number;
//     dislikesCount: number;
//     myStatus: LikeStatus;
//   };
//
//   @Prop({ type: [{ userId: String, status: String }] })
//   likes: { userId: string; status: LikeStatus }[];
//
//   @Prop()
//   createdAt: Date;
//
//   static createInstance(
//     postId: string,
//     userId: string,
//     userLogin: string,
//     content: string,
//   ): CommentDocument {
//     const comment = new this() as CommentDocument;
//
//     comment.postId = postId;
//     comment.content = content;
//     comment.userId = userId;
//     comment.userLogin = userLogin;
//     comment.likesInfo = {
//       likesCount: 0,
//       dislikesCount: 0,
//       myStatus: 'None',
//     };
//
//     return comment;
//   }
//
//   getMyStatus(userId?: string): LikeStatus {
//     if (!userId) {
//       return 'None';
//     }
//
//     const userLike = this.likes?.find((like) => like.userId === userId);
//     return userLike ? userLike.status : 'None';
//   }
//
//   updateContent(content: string) {
//     this.content = content;
//   }
//
//   updateLikeStatus(userId: string, newStatus: LikeStatus) {
//     if (!userId) return;
//     if (!this.likes) this.likes = [];
//
//     const existing = this.likes?.find((like) => like.userId === userId);
//
//     if (existing) {
//       if (existing.status === newStatus) return;
//       existing.status = newStatus;
//     } else {
//       this.likes.push({ userId, status: newStatus });
//     }
//
//     this.likesInfo.likesCount = this.likes.filter((like) => like.status === 'Like').length;
//     this.likesInfo.dislikesCount = this.likes.filter((like) => like.status === 'Dislike').length;
//     this.likesInfo.myStatus = this.getMyStatus(userId);
//   }
// }
//
// export const CommentSchema = SchemaFactory.createForClass(Comment);
// CommentSchema.loadClass(Comment);
//
// export type CommentDocument = HydratedDocument<Comment>;
// export type CommentModelType = Model<CommentDocument> & typeof Comment;
