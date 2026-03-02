// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { CreatePostDto } from '../api/dto/create-post.dto';
// import { UpdatePostDto } from '../api/dto/update-post.dto';
// import { LikeStatus } from '../types/like-status.type';
//
// export class NewestLike {
//   addedAt: Date;
//   userId: string;
//   login: string;
//   status: LikeStatus;
// }
//
// export class ExtendedLikesInfo {
//   likesCount: number;
//   dislikesCount: number;
//   myStatus: LikeStatus;
//   newestLikes: NewestLike[];
// }
//
// @Schema({ timestamps: { createdAt: true, updatedAt: false } })
// export class Post {
//   @Prop({ type: String, required: true })
//   title: string;
//
//   @Prop({ type: String, required: true })
//   shortDescription: string;
//
//   @Prop({ type: String, required: true })
//   content: string;
//
//   @Prop({ type: String, required: true })
//   blogId: string;
//
//   @Prop({ type: String, required: true })
//   blogName: string;
//
//   @Prop({
//     _id: false,
//     default: {
//       likesCount: 0,
//       dislikesCount: 0,
//       myStatus: 'None',
//       newestLikes: [],
//     },
//     type: {
//       likesCount: { type: Number },
//       dislikesCount: { type: Number },
//       myStatus: { type: String },
//       newestLikes: [
//         {
//           _id: false,
//           addedAt: { type: Date },
//           userId: { type: String },
//           login: { type: String },
//           status: { type: String },
//         },
//       ],
//     },
//   })
//   extendedLikesInfo: ExtendedLikesInfo;
//
//   @Prop()
//   createdAt: Date;
//
//   static createInstance(dto: CreatePostDto, blogName: string): PostDocument {
//     const post = new this() as PostDocument;
//
//     post.title = dto.title;
//     post.shortDescription = dto.shortDescription;
//     post.content = dto.content;
//     post.blogId = dto.blogId;
//     post.blogName = blogName;
//     post.extendedLikesInfo = {
//       likesCount: 0,
//       dislikesCount: 0,
//       myStatus: 'None',
//       newestLikes: [],
//     };
//
//     return post;
//   }
//
//   update(dto: UpdatePostDto, blogName: string) {
//     this.title = dto.title;
//     this.shortDescription = dto.shortDescription;
//     this.content = dto.content;
//     this.blogId = dto.blogId;
//     this.blogName = blogName;
//   }
//
//   computeExtendedLikesInfo(currentUserId?: string) {
//     const extended = this.extendedLikesInfo;
//     extended.myStatus = 'None';
//
//     if (!currentUserId) return;
//
//     const reaction = extended.newestLikes.find((r) => r.userId === currentUserId);
//
//     if (reaction) {
//       extended.myStatus = reaction.status;
//     }
//   }
//
//   updateLikeStatus(userId: string, login: string, status: LikeStatus): void {
//     const likesInfo = this.extendedLikesInfo;
//
//     const existingIndex = likesInfo.newestLikes.findIndex((l) => l.userId === userId);
//     let prevStatus: LikeStatus = 'None';
//     if (existingIndex !== -1) prevStatus = likesInfo.newestLikes[existingIndex].status;
//
//     if (prevStatus === status) return;
//
//     // удаляем старый статус
//     if (existingIndex !== -1) {
//       if (prevStatus === 'Like') likesInfo.likesCount--;
//       if (prevStatus === 'Dislike') likesInfo.dislikesCount--;
//       likesInfo.newestLikes.splice(existingIndex, 1);
//     }
//
//     // добавляем новый статус
//     if (status === 'Like') {
//       likesInfo.likesCount++;
//       likesInfo.newestLikes.push({
//         userId,
//         login,
//         addedAt: new Date(),
//         status,
//       });
//     }
//
//     if (status === 'Dislike') {
//       likesInfo.dislikesCount++;
//       likesInfo.newestLikes.push({
//         userId,
//         login,
//         addedAt: new Date(),
//         status: 'Dislike',
//       });
//     }
//
//     likesInfo.newestLikes.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
//   }
// }
//
// export const PostSchema = SchemaFactory.createForClass(Post);
// PostSchema.loadClass(Post);
//
// export type PostDocument = HydratedDocument<Post>;
// export type PostModelType = Model<PostDocument> & typeof Post;
