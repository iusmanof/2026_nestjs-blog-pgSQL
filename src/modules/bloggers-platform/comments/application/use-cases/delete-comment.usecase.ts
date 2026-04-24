import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import CommentsRepository from '../../infrastructire/comment.repository';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    if (!command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized, // новый код
        message: 'User is not authenticated',
        extensions: [new Extension('Missing authentication', 'userId')],
      });
    }

    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Comment not found`,
        extensions: [new Extension('Comment not found', 'commentId')],
      });
    }
    if (command.userId !== comment.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: `Access denied`,
        extensions: [new Extension('Access denied', 'userId')],
      });
    }

    comment.delete();
    await this.commentsRepository.remove(comment.getId());
  }
}
