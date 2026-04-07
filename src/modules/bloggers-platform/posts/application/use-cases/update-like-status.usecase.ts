import { UpdateLikeStatusDto } from '../../api/dto/update-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import UsersRepository from '@user-accounts/infrastructure/users.repository';

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
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: UpdateLikeStatusCommand): Promise<any> {
    const { userId, postId, dto } = command;

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }

    const user = await this.usersRepository.findById(command.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'user not found',
      });
    }

    // const checkedPostId = await this.postsQueryRepository.findOrNotFoundFail(postId);
    //
    // if (!checkedPostId.length) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.NotFound,
    //     message: 'Post not found',
    //     extensions: [new Extension('Post with given id does not exist', 'id')],
    //   });
    // }

    // if (!userId) {
    //   throw new DomainException({
    //     code: DomainExceptionCode.Unauthorized,
    //     message: 'User not found',
    //   });
    // }

    // TODO DDD + Typorm
    return await this.postsRepository.setLikeStatus(userId, postId, dto.likeStatus);
  }
}
