import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import PostsQueryRepository from '../../../posts/infrastructure/posts.query-repository';
import { PostsQueryParamsDto } from '../../../posts/api/dto/posts-query-params.dto';
import { PostViewDto } from '../../../posts/api/dto/post-view.dto';
import { PostPaginatedViewDto } from '../../../posts/api/dto/post-paginated.view.dto';

export class GetPostsForBlogQuery {
  constructor(
    public blogId: string,
    public queryParams: PostsQueryParamsDto,
    public userId?: string,
  ) {}
}

@QueryHandler(GetPostsForBlogQuery)
export class GetPostsForBlogQueryHandler implements IQueryHandler<
  GetPostsForBlogQuery,
  PostPaginatedViewDto<PostViewDto>
> {
  constructor(
    @Inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({
    blogId,
    queryParams,
    userId,
  }: GetPostsForBlogQuery): Promise<PostPaginatedViewDto<PostViewDto>> {
    // TODO getPostsForBlog() слишком большой sql запрос
    const { items, totalCount } = await this.postsQueryRepository.getPostsForBlog(
      blogId,
      queryParams,
      userId,
    );
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: items.map(PostViewDto.mapToView),
    };
  }
}
