// import { UpdateLikeStatusDto } from '../../api/dto/update-like-status.dto';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import PostsRepository from '../../infrastructure/posts.repository';
// import PostsQueryRepository from '../../infrastructure/posts.query-repository';
// import { DomainException } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';
//
// export class UpdateLikeStatusCommand {
//   constructor(
//     public userId: string,
//     public postId: string,
//     public login: string,
//     public dto: UpdateLikeStatusDto,
//   ) {}
// }
//
// @CommandHandler(UpdateLikeStatusCommand)
// export class UpdateLikeStatusUseCase implements ICommandHandler<UpdateLikeStatusCommand> {
//   constructor(
//     private readonly postsRepository: PostsRepository,
//     private readonly postsQueryRepository: PostsQueryRepository,
//   ) {}
//   async execute(command: UpdateLikeStatusCommand): Promise<any> {
//     if (!command.userId) {
//       // throw new UnauthorizedException('User not found');
//       throw new DomainException({
//         code: DomainExceptionCode.Unauthorized,
//         message: 'User not found',
//       });
//     }
//
//     const post = await this.postsQueryRepository.findById(command.postId);
//     if (!post) {
//       throw new DomainException({
//         code: DomainExceptionCode.NotFound,
//         message: 'Post not found',
//       });
//     }
//
//     return await this.postsRepository.setLikeStatus(
//       command.userId,
//       command.postId,
//       command.login,
//       command.dto.likeStatus,
//     );
//   }
// }
