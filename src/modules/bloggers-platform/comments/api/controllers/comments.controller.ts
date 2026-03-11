import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import type { AuthenticatedRequest } from '@user-accounts/types/authenticated-request.interface';
import { JwtAuthGuard } from '@user-accounts/guards/bearer/jwt-auth.guard';
import { DeleteCommentCommand } from '@modules/bloggers-platform/comments/application/use-cases/delete-comment.usecase';
import { UpdateCommentDto } from '@modules/bloggers-platform/posts/api/dto/update-comment.dto';
import { UpdateCommentCommand } from '@modules/bloggers-platform/comments/application/use-cases/update-comment.usecase';

@Controller('comments')
class CommentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCommentDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.commandBus.execute(new UpdateCommentCommand(commentId, userId, dto));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const userId = req.user.id;
    return this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':commentId/like-status')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async updateCommentLikeStatus(
  //   @Param('commentId') commentId: string,
  //   @Req() req: AuthenticatedRequest,
  //   @Body() dto: UpdateCommentLikeStatusDto,
  // ): Promise<void> {
  //   const userId = req.user.id;
  //   return this.commandBus.execute(new UpdateCommentLikeStatusCommand(commentId, userId, dto));
  // }
}

export default CommentsController;
