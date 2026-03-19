import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/dto/create-blog.dto';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/update-blog.dto';

@Injectable()
class BlogsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async create(dto: CreateBlogDto): Promise<BlogsEntity> {
    const query = `INSERT INTO "Blogs"( "name", "description", "websiteUrl") VALUES($1, $2, $3) RETURNING *`;
    const values = [dto.name, dto.description, dto.websiteUrl];
    const result: BlogsEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  async update(id: string, dto: UpdateBlogDto): Promise<boolean> {
    const query = `UPDATE "Blogs" SET "name" = $2, "description" = $3, "websiteUrl" = $4 WHERE "id" = $1 RETURNING "id"`;
    const values = [id, dto.name, dto.description, dto.websiteUrl];
    const result: [{ id: string }][] = await this.dataSource.query(query, values);
    return result[0].length > 0;
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
