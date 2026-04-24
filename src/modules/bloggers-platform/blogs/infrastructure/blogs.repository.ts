import { Injectable } from '@nestjs/common';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

@Injectable()
class BlogsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async save(blog: BlogsEntity): Promise<BlogsEntity> {
    return await this.dataSource.getRepository(BlogsEntity).save(blog);
  }

  async findById(id: string): Promise<BlogsEntity | null> {
    return await this.dataSource.getRepository(BlogsEntity).findOne({ where: { id: id } });
  }

  async ensureCanDelete(id: string): Promise<number> {
    return await this.dataSource.getRepository(PostsEntity).count({ where: { blogId: id } });
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.getRepository(BlogsEntity).delete({ id: id });
  }

  async deleteAll() {
    await this.dataSource.createQueryBuilder().delete().from('Blogs').execute();
  }
}

export default BlogsRepository;
