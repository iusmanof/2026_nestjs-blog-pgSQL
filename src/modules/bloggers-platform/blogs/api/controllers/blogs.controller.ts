import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '@user-accounts/guards/basic/basic.guard';
import { BlogViewDto } from '@modules/bloggers-platform/blogs/api/dto/blog-view.dto';
import { CreateBlogCommand } from '@modules/bloggers-platform/blogs/application/use-cases/create-blog.usecase';
import { UpdateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/update-blog.dto';
import { UpdateBlogCommand } from '@modules/bloggers-platform/blogs/application/use-cases/update-blog.usecase';
import { DeleteBlogCommand } from '@modules/bloggers-platform/blogs/application/use-cases/delete-blog-use.case';
import { BlogsQueryParamsDto } from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { GetBlogsQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blogs.query-handler';
import { CreatePostForBlogDto } from '@modules/bloggers-platform/posts/api/dto/create-post-for-blog.dto';
import { CreatePostForBlogCommand } from '@modules/bloggers-platform/posts/application/use-cases/create-post-for-blog.usecase';
import { UpdatePostForBlogDto } from '@modules/bloggers-platform/posts/api/dto/update-post-for-blog.dto';
import { UpdatePostCommand } from '@modules/bloggers-platform/posts/application/use-cases/update-post.usecase';
import { DeletePostCommand } from '@modules/bloggers-platform/posts/application/use-cases/delete-post.usecase';

@UseGuards(BasicAuthGuard)
@Controller('/sa/blogs')
class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBlogs(@Query() query: BlogsQueryParamsDto) {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() dto: CreateBlogDto): Promise<BlogViewDto> {
    return await this.commandBus.execute<CreateBlogCommand, BlogViewDto>(
      new CreateBlogCommand(dto),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() dto: UpdateBlogDto): Promise<void> {
    return this.commandBus.execute<UpdateBlogCommand, void>(new UpdateBlogCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    return this.commandBus.execute<DeleteBlogCommand, void>(new DeleteBlogCommand(id));
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  createPostForBlog(@Param('blogId') blogId: string, @Body() dto: CreatePostForBlogDto) {
    return this.commandBus.execute(new CreatePostForBlogCommand(blogId, dto));
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePostForBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostForBlogDto,
  ) {
    return this.commandBus.execute(new UpdatePostCommand(postId, dto, blogId));
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePostForBlog(@Param('blogId') blogId: string, @Param('postId') postId: string) {
    return this.commandBus.execute(new DeletePostCommand(blogId, postId));
  }
}

export default BlogsController;
