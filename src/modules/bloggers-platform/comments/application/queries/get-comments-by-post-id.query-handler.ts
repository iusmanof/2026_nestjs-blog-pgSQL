import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';
import CommentsQueryRepository from '../../infrastructire/comments.query-repository';
import { CommentsQueryParamsDto } from '../../../posts/api/dto/comments-query-params.dto';
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
}

export class GetCommentsByPostIdQuery {
  constructor(
    public postId: string,
    public userId: string,
    public queryParams: CommentsQueryParamsDto,
  ) {}
}

@QueryHandler(GetCommentsByPostIdQuery)
export class GetCommentsByPostIdQueryHandler implements IQueryHandler<GetCommentsByPostIdQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  // async execute({ postId, queryParams, userId }: GetCommentsByPostIdQuery) {
  async execute({ postId, queryParams }: GetCommentsByPostIdQuery) {
    await this.postsQueryRepository.findOrNotFoundFail(postId);

    const { items, totalCount } = await this.commentsQueryRepository.getCommentByPostId(
      postId,
      queryParams,
    );

    // TODO REFACTOR mapping
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: items.map((c) => ({
        id: c.id,
        content: c.content,
        commentatorInfo: {
          userId: c.userId,
          userLogin: c.userLogin,
        },
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: c.likesCount,
          dislikesCount: c.dislikesCount,
          myStatus: 'None',
        },
      })),
    };
  }
}
