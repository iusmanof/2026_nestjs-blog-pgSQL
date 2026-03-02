// import { CommentDocument } from '../../domain/comment.entity';
// import { LikeStatus } from '../../types/like-status.type';
//
// export class CommentViewDto {
//   id: string;
//   content: string;
//   commentatorInfo: {
//     userId: string;
//     userLogin: string;
//   };
//   createdAt: Date;
//   likesInfo: {
//     likesCount: number;
//     dislikesCount: number;
//     myStatus: LikeStatus;
//   };
//
//   static mapToViewWithCurrentStatus = (
//     comment: CommentDocument,
//     currentStatus: LikeStatus,
//   ): CommentViewDto => {
//     return {
//       id: comment._id.toString(),
//       content: comment.content,
//       commentatorInfo: {
//         userId: comment.userId.toString(),
//         userLogin: comment.userLogin,
//       },
//       createdAt: comment.createdAt,
//       likesInfo: {
//         likesCount: comment.likesInfo.likesCount,
//         dislikesCount: comment.likesInfo.dislikesCount,
//         myStatus: currentStatus,
//       },
//     };
//   };
//
//   static mapToViewWithUser = (comment: CommentDocument, currentUserId?: string): CommentViewDto => {
//     let myStatus: LikeStatus = 'None';
//     if (currentUserId) {
//       const userLike = comment.likes.find((l) => l.userId.toString() === currentUserId);
//       if (userLike) {
//         myStatus = userLike.status;
//       }
//     }
//
//     return {
//       id: comment._id.toString(),
//       content: comment.content,
//       commentatorInfo: {
//         userId: comment.userId.toString(),
//         userLogin: comment.userLogin,
//       },
//       createdAt: comment.createdAt,
//       likesInfo: {
//         likesCount: comment.likesInfo.likesCount,
//         dislikesCount: comment.likesInfo.dislikesCount,
//         myStatus,
//       },
//     };
//   };
// }
