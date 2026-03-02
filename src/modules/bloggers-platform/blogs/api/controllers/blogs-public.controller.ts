import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogByIdQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blog-by-id.query-handler';
import { BlogsQueryParamsDto } from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { GetBlogsQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blogs.query-handler';

@Controller('/blogs')
class PublicBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  // @UseGuards(JwtOptionalAuthGuard)
  // @Get(':blogId/posts')
  // @HttpCode(HttpStatus.OK)
  // getAllPostsForBlog(
  //   @Param('blogId') blogId: string,
  //   @Query() query: PostsQueryParamsDto,
  //   @Req() req: AuthenticatedRequest,
  // ) {
  //   const userId = req.user?.id;
  //   return this.queryBus.execute(new GetPostsForBlogQuery(blogId, query, userId));
  // }
  //
}

export default PublicBlogsController;
