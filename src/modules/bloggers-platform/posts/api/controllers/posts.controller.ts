import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '@user-accounts/guards/basic/basic.guard';
import { CreatePostCommand } from '@modules/bloggers-platform/posts/application/use-cases/create-post.usecase';
import { PostViewDto } from '@modules/bloggers-platform/posts/api/dto/post-view.dto';
import { UpdatePostCommand } from '@modules/bloggers-platform/posts/application/use-cases/update-post.usecase';
import { DeletePostCommand } from '@modules/bloggers-platform/posts/application/use-cases/delete-post.usecase';
import { JwtAuthGuard } from '@user-accounts/guards/bearer/jwt-auth.guard';
import { CreateCommentDto } from '@modules/bloggers-platform/posts/api/dto/create-comment.dto';
import type { AuthenticatedRequest } from '@user-accounts/types/authenticated-request.interface';
import { CommentViewDto } from '@modules/bloggers-platform/posts/api/dto/comment-view.dto';
import { CreateCommentForPostCommand } from '@modules/bloggers-platform/comments/application/use-cases/create-comment-for-post.usecase';
import { UpdateLikeStatusDto } from '@modules/bloggers-platform/posts/api/dto/update-like-status.dto';
import { UpdateLikeStatusCommand } from '@modules/bloggers-platform/posts/application/use-cases/update-like-status.usecase';

@Controller('/posts')
class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() dto: CreatePostDto) {
    return await this.commandBus.execute<CreatePostCommand, PostViewDto>(
      new CreatePostCommand(dto),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: CreatePostDto): Promise<PostViewDto> {
    return this.commandBus.execute(new UpdatePostCommand(id, dto));
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string, @Param('id') blogId: string): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(id, blogId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommentViewDto> {
    const userId = req.user?.id;
    const login = req.user?.login;
    return await this.commandBus.execute(
      new CreateCommentForPostCommand(postId, userId, login, dto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('postId') postId: string,
    @Body() dto: UpdateLikeStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const userId = req.user?.id;
    const login = req.user?.login;
    return this.commandBus.execute(new UpdateLikeStatusCommand(userId, postId, login, dto));
  }
}

export default PostsController;
