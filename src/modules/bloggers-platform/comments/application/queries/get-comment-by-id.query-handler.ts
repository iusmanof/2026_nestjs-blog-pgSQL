import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { CommentViewDto } from '../../api/dto/comment-view.dto';
import CommentsQueryRepository from '@modules/bloggers-platform/comments/infrastructire/comments.query-repository';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

export class GetCommentByIdQuery {
  constructor(
    public commentId: string,
    public userId?: string,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<
  GetCommentByIdQuery,
  CommentViewDto
> {
  constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentViewDto> {
    const { userId, commentId } = query;
    const comment = await this.commentsQueryRepository.findById(commentId);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Comment not found`,
        extensions: [new Extension('Comment not found', 'commentId')],
      });
    }

    const myStatus: LikeStatus = userId
      ? await this.commentsQueryRepository.findStatusByUserId(commentId, userId)
      : 'None';

    return CommentViewDto.mapToViewWithCurrentStatus(comment, myStatus);
  }
}
