import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../../posts/infrastructure/posts.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import BlogsRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUsecaseSpecifiedById implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
      });
    }

    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }

    post.delete(post.comments?.length ?? 0);
    await this.postsRepository.remove(post.getId());
  }
}
