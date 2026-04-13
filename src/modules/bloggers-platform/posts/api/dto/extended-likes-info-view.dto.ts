import { NewestLikeViewDto } from '@modules/bloggers-platform/posts/api/dto/newest-like-view.dto';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

export type ExtendedLikesInfoViewDto = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikeViewDto[];
};
