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
import { JwtOptionalAuthGuard } from '@user-accounts/guards/bearer/jwt-optional-auth.guard';
import type { AuthenticatedRequest } from '@user-accounts/types/authenticated-request.interface';
import { PostViewDto } from '@modules/bloggers-platform/posts/api/dto/post-view.dto';
import { GetPostByIdQuery } from '@modules/bloggers-platform/posts/application/queries/get-posts-by-id.query-handler';
import { PostsQueryParamsDto } from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import { GetPostQuery } from '@modules/bloggers-platform/posts/application/queries/get-posts.query-handler';

@Controller('/posts')
class PublicPostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PostViewDto> {
    const userId = req.user?.id;
    return this.queryBus.execute(new GetPostByIdQuery(id, userId));
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Query() query: PostsQueryParamsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PostViewDto> {
    const userId = req.user?.id;
    return this.queryBus.execute(new GetPostQuery(query, userId));
  }

  // @UseGuards(JwtOptionalAuthGuard)
  // @Get(':postId/comments')
  // @HttpCode(HttpStatus.OK)
  // async getCommentForPost(
  //   @Param('postId') postId: string,
  //   @Req() req: AuthenticatedRequest,
  //   @Query() query: CommentsQueryParamsDto,
  // ): Promise<CommentViewDto> {
  //   const userId = req.user?.id;
  //   return await this.queryBus.execute(new GetCommentsByPostIdQuery(postId, userId, query));
  // }
}

export default PublicPostsController;
