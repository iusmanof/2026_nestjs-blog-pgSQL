import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import { CreatePostDto } from '../../api/dto/create-post.dto';
import { PostsEntityWithBlogRowAndLikesRaw, PostViewDto } from '../../api/dto/post-view.dto';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import BlogsRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.repository';

export class CreatePostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand, PostViewDto> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute({ dto }: CreatePostCommand): Promise<PostViewDto> {
    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
      });
    }

    const post = PostsEntity.create(dto);
    await this.postsRepository.save(post);
    return PostViewDto.mapToView(post as PostsEntityWithBlogRowAndLikesRaw);
  }
}
