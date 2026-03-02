// import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
// import { CreatePostForBlogDto } from '../../../posts/api/dto/create-post-for-blog.dto';
// import PostsRepository from '../../../posts/infrastructure/posts.repository';
// import BlogsQueryRepository from '../../infrastructure/blogs.query-repository';
// import { PostViewDto } from '../../../posts/api/dto/post-view.dto';
//
// export class CreatePostForBlogCommand {
//   constructor(
//     public blogId: string, // строка из контроллера
//     public dto: CreatePostForBlogDto,
//   ) {}
// }
//
// @CommandHandler(CreatePostForBlogCommand)
// export class CreatePostForBlogUseCase implements ICommandHandler<
//   CreatePostForBlogCommand,
//   PostViewDto
// > {
//   constructor(
//     private readonly postsRepository: PostsRepository,
//     private readonly blogsQueryRepository: BlogsQueryRepository,
//   ) {}
//
//   async execute(command: CreatePostForBlogCommand): Promise<PostViewDto> {
//     const { blogId, dto } = command;
//     const blog = await this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
//
//     const blogName = blog.name;
//
//     const post = await this.postsRepository.createForBlog(dto, blogId, blogName);
//
//     return PostViewDto.mapToView(post);
//   }
// }
