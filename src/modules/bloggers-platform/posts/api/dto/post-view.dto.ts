import { LikeStatus } from '../../types/like-status.type';
import { NewestLikeViewDto } from '@modules/bloggers-platform/posts/api/dto/newest-like-view.dto';
import { ExtendedLikesInfoViewDto } from '@modules/bloggers-platform/posts/api/dto/extended-likes-info-view.dto';

// TODO DTO RAW и mapper сделать отдельно
// TODO реализация mapper на repository и queryRepository
export type PostsEntityWithBlogRowAndLikesRaw = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date;
  blogName: string;
  likesCount: number;
  dislikesCount: number;
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
