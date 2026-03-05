import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreatePostForBlogDto } from '../../api/dto/create-post-for-blog.dto';
import PostsRepository from '../../infrastructure/posts.repository';

import { PostsEntityWithBlogRowAndExtendedLikes, PostViewDto } from '../../api/dto/post-view.dto';
import BlogsQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';

export class CreatePostForBlogCommand {
  constructor(
    public blogId: string,
    public dto: CreatePostForBlogDto,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase implements ICommandHandler<
  CreatePostForBlogCommand,
  PostViewDto
> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: CreatePostForBlogCommand): Promise<PostViewDto> {
    const { blogId, dto } = command;
    await this.blogsQueryRepository.findOrNotFoundFail(blogId);

    const post = await this.postsRepository.create({
      ...dto,
      blogId,
    });
    return PostViewDto.mapToView(post as PostsEntityWithBlogRowAndExtendedLikes);
  }
}
