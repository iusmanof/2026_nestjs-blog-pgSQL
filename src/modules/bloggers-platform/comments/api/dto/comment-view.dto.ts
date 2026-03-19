import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';
import { PostPaginatedViewDto } from '@modules/bloggers-platform/posts/api/dto/post-paginated.view.dto';

interface PaginatedCommentsArgs {
  items: CommentsEntity[];
  page: number;
  pageSize: number;
  totalCount: number;
  statusMap: Map<string, LikeStatus>;
}

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

  static mapToPaginatedView({
    items,
    page,
    pageSize,
    totalCount,
    statusMap,
  }: PaginatedCommentsArgs) {
    return PostPaginatedViewDto.mapToView({
      items: items.map((comment) =>
        CommentViewDto.mapToViewWithCurrentStatus(comment, statusMap.get(comment.id) || 'None'),
      ),
      page,
      pageSize,
      totalCount,
    });
  }
}
