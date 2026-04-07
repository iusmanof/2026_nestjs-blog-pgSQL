import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../infrastructure/blogs.repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand, void> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [new Extension('Blog with given id does not exist', 'id')],
      });
    }

    blog.delete();
    const count = await this.blogsRepository.ensureCanDelete(blog.getId());

    if (count > 0) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Cannot delete blog with posts',
        extensions: [new Extension('Blog has posts', 'id')],
      });
    }

    await this.blogsRepository.remove(blog.getId());
  }
}
