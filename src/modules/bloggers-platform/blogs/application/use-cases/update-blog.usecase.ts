import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../api/dto/update-blog.dto';
import BlogsRepository from '../../infrastructure/blogs.repository';
import BlogsQueryRepository from '../../infrastructure/blogs.query-repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand, void> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const entity = await this.blogsRepository.update(id, dto);

    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [{ field: 'blog', message: 'Blog not found' }],
      });
    }
  }
}
