// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import {
//   DomainException,
//   Extension,
// } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
// import CommentsRepository from '../../infrastructure/comment.repository';
// import CommentsQueryRepository from '../../infrastructure/comments.query-repository';
//
// export class DeleteCommentCommand {
//   constructor(
//     public commentId: string,
//     public userId: string,
//   ) {}
// }
//
// @CommandHandler(DeleteCommentCommand)
// export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
//   constructor(
//     private readonly commentsRepository: CommentsRepository,
//     private readonly commentsQueryRepository: CommentsQueryRepository,
//   ) {}
//
//   async execute(command: DeleteCommentCommand): Promise<void> {
//     const comment = await this.commentsQueryRepository.findById(command.commentId);
//
//     if (!comment) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: `Comment not found`,
//         extensions: [new Extension('Comment not found', 'commentId')],
//       });
//     }
//
//     if (command.userId !== comment.userId) {
//       throw new DomainException({
//         code: DomainExceptionCode.Forbidden,
//         message: `Access denied`,
//         extensions: [new Extension('Access denied', 'userId')],
//       });
//     }
//
//     await this.commentsRepository.delete(command.commentId);
//   }
// }
