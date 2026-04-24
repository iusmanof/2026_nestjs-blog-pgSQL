import { ExtendedLikesInfoViewDto } from '@modules/bloggers-platform/posts/api/dto/extended-likes-info-view.dto';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo?: ExtendedLikesInfoViewDto;

  static mapToView = (post: PostViewDto): PostViewDto => ({
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: Number(post.extendedLikesInfo?.likesCount ?? 0),
      dislikesCount: Number(post.extendedLikesInfo?.dislikesCount ?? 0),
      myStatus: post.extendedLikesInfo?.myStatus ?? 'None',
      newestLikes: post.extendedLikesInfo?.newestLikes ?? [],
    },
  });
}
