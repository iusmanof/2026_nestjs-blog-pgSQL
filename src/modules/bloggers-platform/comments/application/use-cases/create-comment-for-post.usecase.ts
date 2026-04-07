import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../api/dto/comment-view.dto';
import CommentsRepository from '../../infrastructire/comment.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import PostsRepository from '@modules/bloggers-platform/posts/infrastructure/posts.repository';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';

export class CreateCommentForPostCommand {
  constructor(
    public userId: string,
    public login: string,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase implements ICommandHandler<CreateCommentForPostCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: CreateCommentForPostCommand): Promise<CommentViewDto> {
    if (!command.userId || !command.login) {
      throw new Error('Unauthorized');
    }

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }
    const comment = CommentsEntity.create({
      postId: command.postId,
      userId: command.userId,
      login: command.login,
      content: command.content,
    });

    await this.commentsRepository.save(comment);

    return CommentViewDto.mapToViewWithCurrentStatus(comment, 'None');
  }
}
