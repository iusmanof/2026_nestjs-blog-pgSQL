import { Controller, Get, HttpCode, HttpStatus, Param, Req } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommentViewDto } from '../../../posts/api/dto/comment-view.dto';
import { GetCommentByIdQuery } from '@modules/bloggers-platform/comments/application/queries/get-comment-by-id.query-handler';
// import { JwtOptionalAuthGuard } from '@user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller('comments')
class CommentsPublicController {
  constructor(private readonly queryBus: QueryBus) {}

  // @UseGuards(JwtOptionalAuthGuard)
  @Get(':commentId')
  @HttpCode(HttpStatus.OK)
  async getCommentById(
    @Param('commentId') commentId: string,
    // @Req() req: AuthenticatedRequest,
  ): Promise<CommentViewDto> {
    // const userId = req.user.id;
    // return this.queryBus.execute(new GetCommentByIdQuery(commentId, userId));
    return this.queryBus.execute(new GetCommentByIdQuery(commentId));
  }
}

export default CommentsPublicController;
