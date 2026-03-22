import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../infrastructure/blogs.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand, void> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrFail(id);
    blog.delete();
    await this.blogsRepository.delete(blog.getId());
  }
}
