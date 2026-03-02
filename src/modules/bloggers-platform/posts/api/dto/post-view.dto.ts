import { LikeStatus } from '../../types/like-status.type';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

export type ExtendedLikesInfoViewDto = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikeViewDto[];
};
export type PostsEntityWithBlogRow = PostsEntity & { blogName: string };

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
  // extendedLikesInfo: ExtendedLikesInfoViewDto;

  static mapToView = (post: PostsEntityWithBlogRow): PostViewDto => ({
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    // extendedLikesInfo: {
    //   likesCount: post.extendedLikesInfo.likesCount,
    //   dislikesCount: post.extendedLikesInfo.dislikesCount,
    //   myStatus: post.extendedLikesInfo.myStatus,
    //   newestLikes: post.extendedLikesInfo.newestLikes
    //     .filter((like) => like.status === 'Like')
    //     .slice(0, 3)
    //     .map(
    //       (like): NewestLikeViewDto => ({
    //         userId: like.userId,
    //         login: like.login,
    //         addedAt: like.addedAt,
    //       }),
    //     ),
    // },
  });
}
