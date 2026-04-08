import { PostViewDto } from '@modules/bloggers-platform/posts/api/dto/post-view.dto';

export class PostsQueryMapper {
  // TODO any solve
  static toViewDto(row: any): PostViewDto {
    return {
      id: row.id,
      title: row.title,
      shortDescription: row.shortDescription,
      content: row.content,
      blogId: row.blogId,
      blogName: row.blogName,
      createdAt: row.createdAt,
      extendedLikesInfo: {
        likesCount: Number(row.likesCount),
        dislikesCount: Number(row.dislikesCount),
        myStatus: row.myStatus ?? 'None',
        newestLikes: (row.newestLikes ?? []).map((l: any) => ({
          userId: l.userId,
          login: l.login,
          addedAt: l.addedAt,
        })),
      },
    };
  }
}
