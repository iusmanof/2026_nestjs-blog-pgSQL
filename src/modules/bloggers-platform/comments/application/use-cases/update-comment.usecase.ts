import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { UpdateCommentDto } from '@modules/bloggers-platform/comments/api/dto/update-comment.dto';
import CommentsRepository from '@modules/bloggers-platform/comments/infrastructire/comment.repository';
import CommentsQueryRepository from '@modules/bloggers-platform/comments/infrastructire/comments.query-repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public dto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const { commentId, dto, userId }: UpdateCommentCommand = command;
    const comment: CommentsEntity = await this.commentsQueryRepository.findById(commentId);

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Comment not found`,
        extensions: [new Extension('Comment not found', 'commentId')],
      });
    }

    if (comment.userId !== userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: `Access denied`,
        extensions: [new Extension('Access denied', 'userId')],
      });
    }

    await this.commentsRepository.update(commentId, dto);
  }
}
