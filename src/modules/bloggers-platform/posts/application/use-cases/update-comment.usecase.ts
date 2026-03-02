// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import {
//   DomainException,
//   Extension,
// } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
// import { UpdateCommentDto } from '../../api/dto/update-comment.dto';
// import CommentsRepository from '../../infrastructure/comment.repository';
// import CommentsQueryRepository from '../../infrastructure/comments.query-repository';
//
// export class UpdateCommentCommand {
//   constructor(
//     public commentId: string,
//     public userId: string,
//     public dto: UpdateCommentDto,
//   ) {}
// }
//
// @CommandHandler(UpdateCommentCommand)
// export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
//   constructor(
//     private readonly commentsRepository: CommentsRepository,
//     private readonly commentsQueryRepository: CommentsQueryRepository,
//   ) {}
//   async execute(command: UpdateCommentCommand): Promise<void> {
//     const { commentId, dto, userId } = command;
//     const comment = await this.commentsQueryRepository.findById(commentId);
//
//     if (!comment) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: `Comment not found`,
//         extensions: [new Extension('Comment not found', 'commentId')],
//       });
//     }
//
//     if (comment.userId !== userId) {
//       throw new DomainException({
//         code: DomainExceptionCode.Forbidden,
//         message: `Access denied`,
//         extensions: [new Extension('Access denied', 'userId')],
//       });
//     }
//
//     await this.commentsRepository.update(commentId, dto);
//   }
// }
