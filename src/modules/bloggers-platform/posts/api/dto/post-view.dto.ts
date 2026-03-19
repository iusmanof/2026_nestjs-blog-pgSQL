import { LikeStatus } from '../../types/like-status.type';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

export type ExtendedLikesInfoViewDto = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikeViewDto[];
};

export type NewestLikeViewDto = {
  userId: string;
  login: string;
  addedAt: Date;
};

export type PostsEntityWithBlogRowAndLikesRaw = PostsEntity & {
  blogName: string;
  likesCount: string; // приходит из query как string
  dislikesCount: string;
  myStatus: LikeStatus;
  newestLikes: NewestLikeViewDto[];
};

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfoViewDto;

  static mapToView = (post: PostsEntityWithBlogRowAndLikesRaw): PostViewDto => ({
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: Number(post.likesCount ?? 0),
      dislikesCount: Number(post.dislikesCount ?? 0),
      myStatus: post.myStatus ?? 'None',
      newestLikes: post.newestLikes ?? [],
    },
  });
}
