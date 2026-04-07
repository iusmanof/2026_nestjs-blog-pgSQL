import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../api/dto/update-post.dto';
import PostsRepository from '../../infrastructure/posts.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public dto: UpdatePostDto,
    public blogId?: string,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(command: UpdatePostCommand): Promise<void> {
    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }

    if (post.blogId !== command.blogId) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found in this blog',
      });
    }

    post.changeDetails(command.dto);
    await this.postsRepository.save(post);
    //   const entity = await this.postsRepository.update(command.postId, dto, command.blogId);
    //   if (!entity) {
    //     throw new DomainException({
    //       code: DomainExceptionCode.NotFound,
    //       message: 'Post not found',
    //     });
    //   }
  }
}
