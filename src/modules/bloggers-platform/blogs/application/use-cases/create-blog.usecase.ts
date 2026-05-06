import { CreateBlogDto } from '../../api/dto/input/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../infrastructure/blogs.repository';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { BlogViewDto } from '@modules/bloggers-platform/blogs/api/dto/view/blog-view.dto';
import { IsString } from 'class-validator';

export class CreateBlogCommand {
  @IsString()
  public name: string;
  @IsString()
  public websiteUrl: string;
  @IsString()
  description: string;

  constructor(input: CreateBlogCommand) {
    Object.assign(this, input);
  }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command): Promise<BlogViewDto> {
    const blog = BlogsEntity.create(command as CreateBlogDto);
    await this.blogsRepository.save(blog);
    return BlogViewDto.mapToView(blog);
  }
}
