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
import BlogsPublicController from '@modules/bloggers-platform/blogs/api/controllers/blogs-public.controller';
import PostsPublicController from '@modules/bloggers-platform/posts/api/controllers/posts-public.controller';
import { UpdatePostUseCase } from '@modules/bloggers-platform/posts/application/use-cases/update-post.usecase';
import { DeletePostUsecaseSpecifiedById } from '@modules/bloggers-platform/blogs/application/use-cases/delete-post.usecase-specified-by-id';
import { GetPostByIdQueryHandler } from '@modules/bloggers-platform/posts/application/queries/get-posts-by-id.query-handler';
import PostsQueryRepository from '@modules/bloggers-platform/posts/infrastructure/posts.query-repository';
import { GetPostQueryHandler } from '@modules/bloggers-platform/posts/application/queries/get-posts.query-handler';
import { CreatePostForBlogUseCase } from '@modules/bloggers-platform/posts/application/use-cases/create-post-for-blog.usecase';
import { GetPostsForBlogQueryHandler } from '@modules/bloggers-platform/posts/application/queries/get-posts-for-blog.query-handler';
import { PostLikesEntity } from '@modules/bloggers-platform/posts/domain/post-likes.entity';
import { CreateCommentForPostUseCase } from '@modules/bloggers-platform/comments/application/use-cases/create-comment-for-post.usecase';
import CommentsRepository from '@modules/bloggers-platform/comments/infrastructire/comment.repository';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { GetCommentsByPostIdQueryHandler } from '@modules/bloggers-platform/comments/application/queries/get-comments-by-post-id.query-handler';
import { CommentLikesEntity } from '@modules/bloggers-platform/comments/domain/comment-like.entity';
import CommentsPublicController from '@modules/bloggers-platform/comments/api/controllers/comments-public.controller';
import { GetCommentByIdQueryHandler } from '@modules/bloggers-platform/comments/application/queries/get-comment-by-id.query-handler';
import CommentsController from '@modules/bloggers-platform/comments/api/controllers/comments.controller';
import { DeleteCommentUseCase } from '@modules/bloggers-platform/comments/application/use-cases/delete-comment.usecase';
import { UpdateCommentUseCase } from '@modules/bloggers-platform/comments/application/use-cases/update-comment.usecase';
import { UpdateLikeStatusUseCase } from '@modules/bloggers-platform/posts/application/use-cases/update-like-status.usecase';
import CommentsQueryRepository from '@modules/bloggers-platform/comments/infrastructire/comments.query-repository';
import { UpdateCommentLikeStatusUseCase } from '@modules/bloggers-platform/comments/application/use-cases/update-comment-like-status.usecase';
import UsersRepository from '@user-accounts/infrastructure/users.repository';
import BlogsSuperAdminPublicController from '@modules/bloggers-platform/blogs/api/controllers/blogs-sa-public.controller';
import { TestEntity } from '@modules/bloggers-platform/test/test.entity';
import PostsLikesRepository from '@modules/bloggers-platform/posts/infrastructure/post-like.repository';

const controllers = [
  BlogsController,
  BlogsPublicController,
  BlogsSuperAdminPublicController,
  PostsController,
  PostsPublicController,
  CommentsController,
  CommentsPublicController,
];
const repositories = [
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  CommentsRepository,
  CommentsQueryRepository,
  PostsLikesRepository,
  UsersRepository,
];
const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUsecaseSpecifiedById,
  CreatePostForBlogUseCase,
  CreateCommentForPostUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  UpdateLikeStatusUseCase,
  UpdateCommentLikeStatusUseCase,
];
const handlers = [
  GetBlogByIdQueryHandler,
  GetBlogsQueryHandler,
  GetPostByIdQueryHandler,
  GetPostQueryHandler,
  GetPostsForBlogQueryHandler,
  GetCommentsByPostIdQueryHandler,
  GetCommentByIdQueryHandler,
];
const services = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      BlogsEntity,
      PostsEntity,
      PostLikesEntity,
      CommentsEntity,
      CommentLikesEntity,
      TestEntity,
    ]),
  ],
  controllers: [...controllers],
  providers: [...repositories, ...useCases, ...handlers, ...services],
  exports: [BlogsRepository, PostsRepository, CommentsRepository],
})
export class BloggersPlatformModule {}
