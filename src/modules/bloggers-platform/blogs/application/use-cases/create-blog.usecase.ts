import { CreateBlogDto } from '../../api/dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../infrastructure/blogs.repository';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { BlogViewDto } from '@modules/bloggers-platform/blogs/api/dto/blog-view.dto';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ dto }): Promise<BlogViewDto> {
    const blog = BlogsEntity.create(dto as CreateBlogDto);
    await this.blogsRepository.save(blog);
    return BlogViewDto.mapToView(blog);
  }
}
