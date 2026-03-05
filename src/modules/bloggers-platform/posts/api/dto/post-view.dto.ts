import { LikeStatus } from '../../types/like-status.type';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

export type ExtendedLikesInfoViewDto = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikeViewDto[];
};
export type PostsEntityWithBlogRow = PostsEntity & { blogName: string };
export type PostsEntityWithBlogRowAndExtendedLikes = PostsEntity & { blogName: string } & {
  extendedLikesInfo: ExtendedLikesInfoViewDto;
};
export type NewestLikeViewDto = {
  userId: string;
  login: string;
  addedAt: Date;
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

  static mapToView = (
    post: PostsEntityWithBlogRow & { extendedLikesInfo?: ExtendedLikesInfoViewDto },
  ): PostViewDto => ({
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo?.likesCount ?? 0,
      dislikesCount: post.extendedLikesInfo?.dislikesCount ?? 0,
      myStatus: post.extendedLikesInfo?.myStatus ?? 'None',
      newestLikes: post.extendedLikesInfo?.newestLikes ?? [],
    },
  });
}
