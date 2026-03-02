import { Module } from '@nestjs/common';
import BlogsController from './blogs/api/controllers/blogs.controller';
import { CreateBlogUseCase } from '@modules/bloggers-platform/blogs/application/use-cases/create-blog.usecase';
import BlogsRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogByIdQueryHandler } from '@modules/bloggers-platform/blogs/application/queries/get-blog-by-id.query-handler';
import BlogsQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';
import { GetBlogsQueryHandler } from '@modules/bloggers-platform/blogs/application/queries/get-blogs.query-handler';
import { UpdateBlogUseCase } from '@modules/bloggers-platform/blogs/application/use-cases/update-blog.usecase';
import { DeleteBlogUseCase } from '@modules/bloggers-platform/blogs/application/use-cases/delete-blog-use.case';
import PostsRepository from '@modules/bloggers-platform/posts/infrastructure/posts.repository';
import PostsController from '@modules/bloggers-platform/posts/api/controllers/posts.controller';
import { CreatePostUseCase } from '@modules/bloggers-platform/posts/application/use-cases/create-post.usecase';
import PublicBlogsController from '@modules/bloggers-platform/blogs/api/controllers/blogs-public.controller';
import PublicPostsController from '@modules/bloggers-platform/posts/api/controllers/posts-public.controller';
import { UpdatePostUseCase } from '@modules/bloggers-platform/posts/application/use-cases/update-post.usecase';
import { DeletePostUseCase } from '@modules/bloggers-platform/posts/application/use-cases/delete-post.usecase';
import { GetPostByIdQueryHandler } from '@modules/bloggers-platform/posts/application/queries/get-posts-by-id.query-handler';
import PostsQueryRepository from '@modules/bloggers-platform/posts/infrastructure/posts.query-repository';
import { GetPostQueryHandler } from '@modules/bloggers-platform/posts/application/queries/get-posts.query-handler';

const controllers = [
  BlogsController,
  PublicBlogsController,
  PostsController,
  PublicPostsController,
];
const repositories = [BlogsRepository, BlogsQueryRepository, PostsRepository, PostsQueryRepository];
const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];
const handlers = [
  GetBlogByIdQueryHandler,
  GetBlogsQueryHandler,
  GetPostByIdQueryHandler,
  GetPostByIdQueryHandler,
  GetPostQueryHandler,
];
const services = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([BlogsEntity]),
    TypeOrmModule.forFeature([PostsEntity]),
  ],
  controllers: [...controllers],
  providers: [...repositories, ...useCases, ...handlers, ...services],
  exports: [BlogsRepository, PostsRepository],
})
export class BloggersPlatformModule {}
