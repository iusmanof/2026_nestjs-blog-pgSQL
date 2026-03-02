// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import {
//   DomainException,
//   Extension,
// } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
// import CommentsQueryRepository from '../../infrastructure/comments.query-repository';
// import { CommentViewDto } from '../../api/dto/comment-view.dto';
//
// export class GetCommentByIdQuery {
//   constructor(
//     public commentId: string,
//     public userId: string,
//   ) {}
// }
//
// @QueryHandler(GetCommentByIdQuery)
// export class GetCommentByIdQueryHandler implements IQueryHandler<
//   GetCommentByIdQuery,
//   CommentViewDto
// > {
//   constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}
//
//   async execute(query: GetCommentByIdQuery): Promise<CommentViewDto> {
//     const comment = await this.commentsQueryRepository.findById(query.commentId);
//
//     if (!comment) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: `Comment not found`,
//         extensions: [new Extension('Comment not found', 'commentId')],
//       });
//     }
//
//     const myStatus = comment.getMyStatus(query.userId);
//
//     return CommentViewDto.mapToViewWithCurrentStatus(comment, myStatus);
//   }
// }
