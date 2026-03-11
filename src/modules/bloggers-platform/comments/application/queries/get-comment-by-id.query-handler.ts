import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import CommentsQueryRepository from '../../infrastructire/comments.query-repository';
import { CommentViewDto } from '../../../posts/api/dto/comment-view.dto';

export class GetCommentByIdQuery {
  constructor(
    public commentId: string,
    // public userId: string,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<
  GetCommentByIdQuery,
  CommentViewDto
> {
  constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentViewDto> {
    // const { userId, commentId } = query;
    const { commentId } = query;
    const comment = await this.commentsQueryRepository.findById(commentId);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Comment not found`,
        extensions: [new Extension('Comment not found', 'commentId')],
      });
    }

    // const myStatus = await this.commentsQueryRepository.findStatusByUserId(commentId, userId);
    //   return CommentViewDto.mapToViewWithCurrentStatus(comment, myStatus);
    return CommentViewDto.mapToViewWithUser(comment, 'None');
  }
}
