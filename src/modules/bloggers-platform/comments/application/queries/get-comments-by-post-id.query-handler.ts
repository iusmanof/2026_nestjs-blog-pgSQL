import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';
import CommentsQueryRepository from '../../infrastructire/comments.query-repository';
import { CommentsQueryParamsDto } from '../../api/dto/comments-query-params.dto';
import { CommentViewDto } from '@modules/bloggers-platform/comments/api/dto/comment-view.dto';

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

  async execute(query: GetCommentsByPostIdQuery) {
    const { postId, userId, queryParams } = query;
    await this.postsQueryRepository.findOrNotFoundFail(postId);

    const { items, totalCount } = await this.commentsQueryRepository.getCommentByPostId(
      postId,
      queryParams,
    );

    return CommentViewDto.mapToPaginatedView({
      items: items,
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
    });
  }
}
