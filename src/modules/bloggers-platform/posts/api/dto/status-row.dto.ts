import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

export type StatusRowDto = {
  postId: string;
  status: LikeStatus;
};
