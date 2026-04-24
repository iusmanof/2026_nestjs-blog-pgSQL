import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../api/dto/blog-view.dto';
import BlogQueryRepository from '../../infrastructure/blogs.query-repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class GetBlogByIdQuery {
  constructor(
    public id: string,
    public userId: string | null,
  ) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}
  async execute(query: GetBlogByIdQuery): Promise<BlogViewDto> {
    const blog = await this.blogQueryRepository.findById(query.id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [new Extension('Blog with given id does not exist', 'id')],
      });
    }

    return BlogViewDto.mapToView(blog);
  }
}
