import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreatePostForBlogDto } from '../../api/dto/create-post-for-blog.dto';
import PostsRepository from '../../infrastructure/posts.repository';

import { PostsEntityWithBlogRowAndLikesRaw, PostViewDto } from '../../api/dto/post-view.dto';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import BlogsRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.repository';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

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
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: CreatePostForBlogCommand): Promise<PostViewDto> {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
      });
    }
    const blogId = blog.getId();

    const postEntity = PostsEntity.createPostForBlog({ dto: command.dto, blogId: blogId });
    const post = await this.postsRepository.save(postEntity);

    post.changeDetails(command.dto);
    const postDTO = {
      ...post,
      blogName: blog.getName(),
      likesCount: '0',
      dislikesCount: '0',
      myStatus: 'None',
      newestLikes: [],
    };
    return PostViewDto.mapToView(postDTO as PostsEntityWithBlogRowAndLikesRaw);
  }
}
