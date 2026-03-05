import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import BlogQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';
import PostsQueryRepository from '@modules/bloggers-platform/posts/infrastructure/posts.query-repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { blogId, postId } = command;
    await this.blogQueryRepository.findOrNotFoundFail(blogId);
    await this.postsQueryRepository.findOrNotFoundFail(postId);

    const deleted = await this.postsRepository.delete(postId);
    if (!deleted) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }
  }
}
