// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Put,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { UpdateCommentLikeStatusCommand } from '../../application/use-cases/update-comment-like-status.usecase';
// import { UpdateCommentLikeStatusDto } from '../dto/update-comment-like-status.dto';
// import { UpdateCommentCommand } from '../../application/use-cases/update-comment.usecase';
// import { UpdateCommentDto } from '../dto/update-comment.dto';
// import { DeleteCommentCommand } from '../../application/use-cases/delete-comment.usecase';
// import { GetCommentByIdQuery } from '../../application/queries/get-comment-by-id.query-handler';
// import { CommentViewDto } from '../dto/comment-view.dto';
// import type { AuthenticatedRequest } from '../../../../user-accounts/types/authenticated-request.interface';
// import { JwtAuthGuard } from '../../../../user-accounts/guards/bearer/jwt-auth.guard';
//
// function OptionalJwtAuthGuard() {}
//
// @Controller('comments')
// class CommentsController {
//   constructor(
//     private readonly commandBus: CommandBus,
//     private readonly queryBus: QueryBus,
//   ) {}
//
//   @UseGuards(JwtAuthGuard)
//   @Put(':commentId/like-status')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async updateCommentLikeStatus(
//     @Param('commentId') commentId: string,
//     @Req() req: AuthenticatedRequest,
//     @Body() dto: UpdateCommentLikeStatusDto,
//   ): Promise<void> {
//     const userId = req.user.id;
//     return this.commandBus.execute(new UpdateCommentLikeStatusCommand(commentId, userId, dto));
//   }
//
//   @UseGuards(JwtAuthGuard)
//   @Put(':commentId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async updateComment(
//     @Param('commentId') commentId: string,
//     @Req() req: AuthenticatedRequest,
//     @Body() dto: UpdateCommentDto,
//   ): Promise<void> {
//     const userId = req.user.id;
//     return this.commandBus.execute(new UpdateCommentCommand(commentId, userId, dto));
//   }
//
//   @UseGuards(JwtAuthGuard)
//   @Delete(':commentId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteComment(
//     @Param('commentId') commentId: string,
//     @Req() req: AuthenticatedRequest,
//   ): Promise<void> {
//     const userId = req.user.id;
//     return this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
//   }
//
//   @UseGuards(OptionalJwtAuthGuard)
//   @Get(':commentId')
//   @HttpCode(HttpStatus.OK)
//   async getCommentById(
//     @Param('commentId') commentId: string,
//     @Req() req: AuthenticatedRequest,
//   ): Promise<CommentViewDto> {
//     const userId = req.user.id;
//     return this.queryBus.execute(new GetCommentByIdQuery(commentId, userId));
//   }
// }
//
// export default CommentsController;
