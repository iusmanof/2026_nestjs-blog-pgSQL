import {
  Body,
  Controller,
  Delete,
  Get,
  // Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  // Query,
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

  // @UseGuards(BasicAuthGuard)
  // @Post(':blogId/posts')
  // @HttpCode(HttpStatus.CREATED)
  // createPostForBlog(@Param('blogId') blogId: string, @Body() dto: CreatePostForBlogDto) {
  //   return this.commandBus.execute(new CreatePostForBlogCommand(blogId, dto));
  // }
}

export default BlogsController;
