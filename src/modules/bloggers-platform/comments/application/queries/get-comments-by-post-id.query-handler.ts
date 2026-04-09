import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';
import { CommentsQueryParamsDto } from '../../api/dto/comments-query-params.dto';
import { CommentViewDto } from '@modules/bloggers-platform/comments/api/dto/comment-view.dto';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import CommentsQueryRepository from '@modules/bloggers-platform/comments/infrastructire/comments.query-repository';

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

    const post = await this.postsQueryRepository.findById(query.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }

    const { items, totalCount, statusMap } = await this.commentsQueryRepository.getCommentByPostId(
      postId,
      userId,
      queryParams,
    );

    return CommentViewDto.mapToPaginatedView({
      items: items,
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      statusMap: statusMap,
    });
  }
}
