import { UpdateCommentLikeStatusDto } from '../../api/dto/update-comment-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import CommentsRepository from '@modules/bloggers-platform/comments/infrastructire/comment.repository';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public dto: UpdateCommentLikeStatusDto,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentLikeStatusCommand): Promise<void> {
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
