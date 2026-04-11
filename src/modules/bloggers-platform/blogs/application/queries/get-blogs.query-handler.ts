import { BlogsQueryParamsDto } from '../../api/dto/blogs-query-params.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogPaginatedViewDto } from '../../api/dto/blog-paginated.view.dto';
import { BlogViewDto } from '../../api/dto/blog-view.dto';
import { Inject } from '@nestjs/common';
import BlogQueryRepository from '../../infrastructure/blogs.query-repository';
import BlogsQueryRepository from '../../infrastructure/blogs.query-repository';

export class GetBlogsQuery {
  constructor(public queryParams: BlogsQueryParamsDto) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<
  GetBlogsQuery,
  BlogPaginatedViewDto<BlogViewDto>
> {
  constructor(
    @Inject(BlogQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async execute(query: GetBlogsQuery): Promise<BlogPaginatedViewDto<BlogViewDto>> {
    const { items, totalCount } = await this.blogsQueryRepository.getAll(query.queryParams);

    return BlogPaginatedViewDto.mapToView<BlogViewDto>({
      page: query.queryParams.pageNumber,
      pageSize: query.queryParams.pageSize,
      totalCount,
      items: items.map(BlogViewDto.mapToView),
    });
  }
}
