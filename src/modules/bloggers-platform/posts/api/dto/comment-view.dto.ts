// import { LikeStatus } from '../../types/like-status.type';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };

  // static mapToViewWithCurrentStatus = (
  //   comment: CommentsEntity,
  //   currentStatus: LikeStatus,
  // ): CommentViewDto => {
  //   return {
  //     id: comment.id.toString(),
  //     content: comment.content,
  //     commentatorInfo: {
  //       userId: comment.userId.toString(),
  //       userLogin: comment.userLogin,
  //     },
  //     createdAt: comment.createdAt,
  //     likesInfo: {
  //       likesCount: comment.likesInfo.likesCount,
  //       dislikesCount: comment.likesInfo.dislikesCount,
  //       myStatus: currentStatus,
  //     },
  //   };
  // };
  static mapToViewWithCurrentStatus = (
    comment: CommentsEntity,
    currentStatus: LikeStatus,
  ): CommentViewDto => {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: currentStatus,
      },
    };
  };

  static mapToViewWithUser = (
    comment: CommentsEntity,
    myStatus: LikeStatus = 'None',
  ): CommentViewDto => {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus,
      },
    };
  };
}
