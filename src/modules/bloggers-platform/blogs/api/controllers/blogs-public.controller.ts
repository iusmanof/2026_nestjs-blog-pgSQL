import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogByIdQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blog-by-id.query-handler';
import { BlogsQueryParamsDto } from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { GetBlogsQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blogs.query-handler';
import { JwtOptionalAuthGuard } from '@user-accounts/guards/bearer/jwt-optional-auth.guard';
import { PostsQueryParamsDto } from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import type { AuthenticatedRequest } from '@user-accounts/types/authenticated-request.interface';
import { GetPostsForBlogQuery } from '@modules/bloggers-platform/posts/application/queries/get-posts-for-blog.query-handler';

@Controller('/blogs')
class BlogsPublicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  getAllPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryParamsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.queryBus.execute(new GetPostsForBlogQuery(blogId, query, userId));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBlogs(@Query() query: BlogsQueryParamsDto) {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getBlogById(@Param('id') id: string) {
    return this.queryBus.execute(new GetBlogByIdQuery(id, null));
  }
}

export default BlogsPublicController;
