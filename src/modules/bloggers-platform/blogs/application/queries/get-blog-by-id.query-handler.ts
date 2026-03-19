import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../api/dto/blog-view.dto';
import BlogQueryRepository from '../../infrastructure/blogs.query-repository';

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
    const entity = await this.blogQueryRepository.findOrNotFoundFail(query.id);
    return BlogViewDto.mapToView(entity);
  }
}
