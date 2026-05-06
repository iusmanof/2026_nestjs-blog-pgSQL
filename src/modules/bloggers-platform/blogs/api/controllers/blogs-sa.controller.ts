import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogsQueryParamsDto } from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { GetBlogsQuery } from '@modules/bloggers-platform/blogs/application/queries/get-blogs.query-handler';
import { BasicAuthGuard } from '@user-accounts/guards/basic/basic.guard';

@UseGuards(BasicAuthGuard)
@Controller('/sa/blogs')
class BlogsSuperAdminPublicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBlogs(@Query() query: BlogsQueryParamsDto) {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }
}

export default BlogsSuperAdminPublicController;
