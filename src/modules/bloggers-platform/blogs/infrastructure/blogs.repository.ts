import { Injectable } from '@nestjs/common';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

@Injectable()
class BlogsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async save(blog: BlogsEntity): Promise<BlogsEntity> {
    const query = `INSERT INTO "Blogs"("name","description","websiteUrl","createdAt","isMembership") VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
      blog.getName(),
      blog.getDescription(),
      blog.getWebsiteUrl(),
      blog.getCreatedAt(),
      blog.getIsMembership(),
    ];
    const result: BlogsEntity[] = await this.dataSource.query(query, values);
    const savedBlog = result[0];
    blog.id = savedBlog.id;
    return result[0];
  }
  async findById(id: string): Promise<BlogsEntity> {
    const query = `SELECT * FROM "Blogs" WHERE id = $1`;
    const values = [id];
    const result: BlogsEntity[] = await this.dataSource.query(query, values);
    if (!result.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [new Extension('Blog with given id does not exist', 'id')],
      });
    }
    return BlogsEntity.restore(result[0]);
  }
  // async update(id: string, dto: UpdateBlogDto): Promise<boolean> {
  //   const query = `UPDATE "Blogs" SET "name" = $2, "description" = $3, "websiteUrl" = $4 WHERE "id" = $1 RETURNING "id"`;
  //   const values = [id, dto.name, dto.description, dto.websiteUrl];
  //   const result: [{ id: string }][] = await this.dataSource.query(query, values);
  //   return result[0].length > 0;
  // }

  async update(blog: BlogsEntity): Promise<void> {
    const query = `UPDATE "Blogs" SET "name" = $2, "description" = $3, "websiteUrl" = $4 WHERE "id" = $1 RETURNING "id"`;
    const values = [blog.getId(), blog.getName(), blog.getDescription(), blog.getWebsiteUrl()];
    await this.dataSource.query(query, values);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM "Blogs" WHERE "id" = $1 RETURNING "id"`;
    const values = [id];
    const result: [{ id: string }][] = await this.dataSource.query(query, values);
    return result[0].length > 0;
  }

  async deleteAll() {
    const query = `DELETE FROM "Blogs" `;
    await this.dataSource.query(query);
  }
}

export default BlogsRepository;
