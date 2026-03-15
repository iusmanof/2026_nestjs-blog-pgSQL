import { Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommentViewDto } from '../dto/comment-view.dto';
import { GetCommentByIdQuery } from '@modules/bloggers-platform/comments/application/queries/get-comment-by-id.query-handler';
import { JwtOptionalAuthGuard } from '@user-accounts/guards/bearer/jwt-optional-auth.guard';
import type { AuthenticatedRequest } from '@user-accounts/types/authenticated-request.interface';

@Controller('comments')
class CommentsPublicController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':commentId')
  @HttpCode(HttpStatus.OK)
  async getCommentById(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommentViewDto> {
    const userId = req.user?.id;
    return this.queryBus.execute(new GetCommentByIdQuery(commentId, userId));
  }
}

export default CommentsPublicController;
