import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../infrastructure/blogs.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand, void> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const entity = await this.blogsRepository.delete(id);
    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [{ field: 'blog', message: 'Blog not found' }],
      });
    }
  }
}
