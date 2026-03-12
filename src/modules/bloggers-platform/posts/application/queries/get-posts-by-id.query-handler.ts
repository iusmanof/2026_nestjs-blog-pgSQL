import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsEntityWithBlogRowAndLikesRaw, PostViewDto } from '../../api/dto/post-view.dto';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import PostsQueryRepository from '@modules/bloggers-platform/posts/infrastructure/posts.query-repository';

export class GetPostByIdQuery {
  constructor(
    public postId: string,
    public currentUserId?: string,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostByIdQuery): Promise<PostViewDto> {
    const post = await this.postQueryRepository.findByIdWithRequestingUser(
      query.postId,
      query.currentUserId,
    );

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }

    return PostViewDto.mapToView(post as PostsEntityWithBlogRowAndLikesRaw);
  }
}
