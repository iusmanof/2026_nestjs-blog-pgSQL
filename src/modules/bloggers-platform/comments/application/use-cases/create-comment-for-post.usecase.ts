import { CreateCommentDto } from '../../api/dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../api/dto/comment-view.dto';
import CommentsRepository from '../../infrastructire/comment.repository';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class CreateCommentForPostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public login: string,
    public dto: CreateCommentDto,
  ) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase implements ICommandHandler<CreateCommentForPostCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(command: CreateCommentForPostCommand): Promise<CommentViewDto> {
    const { postId, userId, login, dto } = command;

    const checkedPostId = await this.postsQueryRepository.findOrNotFoundFail(postId);

    if (!checkedPostId.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
        extensions: [new Extension('Post with given id does not exist', 'id')],
      });
    }

    const entity = await this.commentsRepository.create(postId, userId, login, dto.content);

    return CommentViewDto.mapToViewWithCurrentStatus(entity, 'None');
  }
}
