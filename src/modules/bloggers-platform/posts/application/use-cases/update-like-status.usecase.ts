import { UpdateLikeStatusDto } from '../../api/dto/update-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import PostsQueryRepository from '../../infrastructure/posts.query-repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
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
    if (!command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'User not found',
      });
    }

    await this.postsQueryRepository.findOrNotFoundFail(command.postId);

    return await this.postsRepository.setLikeStatus(
      command.userId,
      command.postId,
      command.login,
      command.dto.likeStatus,
    );
  }
}
