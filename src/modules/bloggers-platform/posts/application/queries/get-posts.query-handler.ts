import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryParamsDto } from '../../api/dto/posts-query-params.dto';
import PostsQueryRepository from '../../infrastructure/posts.query-repository';
import { PostPaginatedViewDto } from '../../api/dto/post-paginated.view.dto';
import { PostViewDto } from '../../api/dto/post-view.dto';

export class GetPostQuery {
  constructor(
    public queryParams: PostsQueryParamsDto,
    public userId?: string,
  ) {}
}

@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostQuery): Promise<PostPaginatedViewDto<PostViewDto>> {
    const { items, totalCount } = await this.postsQueryRepository.getAll(query.queryParams);

    // items.forEach((post) => post.computeExtendedLikesInfo(query.userId));
    //
    // computeExtendedLikesInfo(currentUserId?: string) {
    //   const extended = this.extendedLikesInfo;
    //   extended.myStatus = 'None';
    //
    //   if (!currentUserId) return;
    //
    //   const reaction = extended.newestLikes.find(
    //     (r) => r.userId === currentUserId,
    //   );
    //
    //   if (reaction) {
    //     extended.myStatus = reaction.status;
    //   }
    // }

    return PostPaginatedViewDto.mapToView({
      items: items.map(PostViewDto.mapToView),
      page: query.queryParams.pageNumber,
      pageSize: query.queryParams.pageSize,
      totalCount,
    });
  }
}
