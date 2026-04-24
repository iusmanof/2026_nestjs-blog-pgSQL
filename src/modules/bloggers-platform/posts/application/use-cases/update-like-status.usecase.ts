import { UpdateLikeStatusDto } from '../../api/dto/update-like-status.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import UsersRepository from '@user-accounts/infrastructure/users.repository';
import PostsLikesRepository from '@modules/bloggers-platform/posts/infrastructure/post-like.repository';
import { PostLikesEntity } from '@modules/bloggers-platform/posts/domain/post-likes.entity';

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
    private readonly postsLikesRepository: PostsLikesRepository,
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

    let like = await this.postsLikesRepository.find(userId, postId);

    if (!like) {
      like = PostLikesEntity.create(userId, postId, dto.likeStatus);
    } else {
      like.changeStatus(dto.likeStatus);
    }

    await this.postsLikesRepository.save(like);
  }
}
