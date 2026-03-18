import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../api/dto/update-post.dto';
import PostsRepository from '../../infrastructure/posts.repository';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import BlogQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';
import PostsQueryRepository from '@modules/bloggers-platform/posts/infrastructure/posts.query-repository';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public dto: UpdatePostDto,
    public blogId?: string,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(command: UpdatePostCommand): Promise<void> {
    const { postId, dto } = command;
    const blogId = command.dto.blogId ?? command.blogId;

    if (!blogId) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        message: 'blogId is required',
      });
    }

    await this.blogQueryRepository.findOrNotFoundFail(blogId);
    const checkedPostId = await this.postsQueryRepository.findOrNotFoundFail(postId);

    if (!checkedPostId.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
        extensions: [new Extension('Post with given id does not exist', 'id')],
      });
    }

    const entity = await this.postsRepository.update(postId, dto, blogId);
    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }
  }
}
