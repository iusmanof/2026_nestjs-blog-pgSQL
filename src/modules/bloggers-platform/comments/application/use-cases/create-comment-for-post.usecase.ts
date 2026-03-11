import { CreateCommentDto } from '../../../posts/api/dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../../posts/api/dto/comment-view.dto';
import CommentsRepository from '../../infrastructire/comment.repository';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';

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
    console.log(command.userId);
    console.log(command.postId);
    await this.postsQueryRepository.findOrNotFoundFail(command.postId);

    const entity = await this.commentsRepository.create(
      command.postId,
      command.userId,
      command.login,
      command.dto.content,
    );
    // return entity;
    // await this.commentsRepository.save(entity);

    return CommentViewDto.mapToViewWithUser(entity, 'None');
  }
}
