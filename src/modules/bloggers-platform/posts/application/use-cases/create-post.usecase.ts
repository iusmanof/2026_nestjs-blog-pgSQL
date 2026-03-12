import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../infrastructure/posts.repository';
import { CreatePostDto } from '../../api/dto/create-post.dto';
import { PostsEntityWithBlogRowAndLikesRaw, PostViewDto } from '../../api/dto/post-view.dto';
import BlogsQueryRepository from '../../../blogs/infrastructure/blogs.query-repository';

export class CreatePostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand, PostViewDto> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute({ dto }: CreatePostCommand): Promise<PostViewDto> {
    const entity = await this.postsRepository.create(dto);
    return PostViewDto.mapToView(entity as PostsEntityWithBlogRowAndLikesRaw);
  }
}
