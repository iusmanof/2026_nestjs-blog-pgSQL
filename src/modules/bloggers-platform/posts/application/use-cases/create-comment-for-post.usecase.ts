// import { CreateCommentDto } from '../../api/dto/create-comment.dto';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { CommentViewDto } from '../../api/dto/comment-view.dto';
// import CommentsRepository from '../../infrastructure/comment.repository';
// import PostsQueryRepository from '../../infrastructure/posts.query-repository';
// import { DomainException } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
//
// export class CreateCommentForPostCommand {
//   constructor(
//     public postId: string,
//     public userId: string,
//     public login: string,
//     public dto: CreateCommentDto,
//   ) {}
// }
//
// @CommandHandler(CreateCommentForPostCommand)
// export class CreateCommentForPostUseCase implements ICommandHandler<CreateCommentForPostCommand> {
//   constructor(
//     private readonly commentsRepository: CommentsRepository,
//     private readonly postsQueryRepository: PostsQueryRepository,
//   ) {}
//
//   async execute(command: CreateCommentForPostCommand): Promise<CommentViewDto> {
//     const post = await this.postsQueryRepository.findById(command.postId);
//     if (!post) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: 'Post not found',
//       });
//     }
//
//     const entity = this.commentsRepository.create(
//       command.postId,
//       command.userId,
//       command.login,
//       command.dto.content,
//     );
//
//     await this.commentsRepository.save(entity);
//
//     return CommentViewDto.mapToViewWithUser(entity);
//   }
// }
