import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../api/dto/update-blog.dto';
import BlogsRepository from '../../infrastructure/blogs.repository';
import BlogsQueryRepository from '../../infrastructure/blogs.query-repository';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand, void> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrFail(id);
    blog.changeDetails(dto);
    await this.blogsRepository.update(blog);
  }
}
