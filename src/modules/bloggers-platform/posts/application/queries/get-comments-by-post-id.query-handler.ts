// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import PostsQueryRepository from '../../infrastructure/posts.query-repository';
// import CommentsQueryRepository from '../../infrastructure/comments.query-repository';
// import { CommentsQueryParamsDto } from '../../api/dto/comments-query-params.dto';
// import { CommentViewDto } from '../../api/dto/comment-view.dto';
// import { DomainException } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
//
// export class GetCommentsByPostIdQuery {
//   constructor(
//     public postId: string,
//     public userId: string,
//     public queryParams: CommentsQueryParamsDto,
//   ) {}
// }
//
// @QueryHandler(GetCommentsByPostIdQuery)
// export class GetCommentsByPostIdQueryHandler implements IQueryHandler<GetCommentsByPostIdQuery> {
//   constructor(
//     private readonly commentsQueryRepository: CommentsQueryRepository,
//     private readonly postsQueryRepository: PostsQueryRepository,
//   ) {}
//
//   async execute({ postId, queryParams, userId }: GetCommentsByPostIdQuery) {
//     const post = await this.postsQueryRepository.findById(postId);
//     if (!post) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: 'Post not found',
//       });
//     }
//
//     const { items, totalCount } = await this.commentsQueryRepository.getByPostId(
//       postId,
//       queryParams,
//     );
//
//     return {
//       pagesCount: Math.ceil(totalCount / queryParams.pageSize),
//       page: queryParams.pageNumber,
//       pageSize: queryParams.pageSize,
//       totalCount,
//       items: items.map((comment) => CommentViewDto.mapToViewWithUser(comment, userId)),
//     };
//   }
// }
