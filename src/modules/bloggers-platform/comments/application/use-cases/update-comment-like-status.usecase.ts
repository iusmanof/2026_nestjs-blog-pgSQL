import { UpdateCommentLikeStatusDto } from '../../api/dto/update-comment-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import CommentsRepository from '@modules/bloggers-platform/comments/infrastructire/comment.repository';
import CommentsQueryRepository from '@modules/bloggers-platform/comments/infrastructire/comments.query-repository';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public dto: UpdateCommentLikeStatusDto,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute(command: UpdateCommentLikeStatusCommand): Promise<void> {
    const checkedCommentId = await this.commentsQueryRepository.findOrNotFail(command.commentId);
    if (!checkedCommentId.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Comment id not found',
        extensions: [new Extension('Coment with given id does not exist', 'id')],
      });
    }

    const updated = await this.commentsRepository.updateLikeStatus(
      command.commentId,
      command.userId,
      command.dto.likeStatus,
    );

    if (!updated) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Comment not found.',
        extensions: [new Extension("Comment with id doesn't exist", 'commentId')],
      });
    }
  }
}
