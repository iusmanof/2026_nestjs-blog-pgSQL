import { UpdateLikeStatusDto } from '../../api/dto/update-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import PostsQueryRepository from '../../infrastructure/posts.query-repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class UpdateLikeStatusCommand {
  constructor(
    public userId: string,
    public postId: string,
    public login: string,
    public dto: UpdateLikeStatusDto,
  ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusUseCase implements ICommandHandler<UpdateLikeStatusCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(command: UpdateLikeStatusCommand): Promise<any> {
    const { userId, postId, dto } = command;
    const checkedPostId = await this.postsQueryRepository.findOrNotFoundFail(postId);

    if (!checkedPostId.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
        extensions: [new Extension('Post with given id does not exist', 'id')],
      });
    }

    if (!userId) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'User not found',
      });
    }

    return await this.postsRepository.setLikeStatus(userId, postId, dto.likeStatus);
  }
}
