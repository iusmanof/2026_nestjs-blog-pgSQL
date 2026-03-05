import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePostDto } from '@modules/bloggers-platform/posts/api/dto/create-post.dto';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import BlogQueryRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.query-repository';
import { CreatePostForBlogDto } from '@modules/bloggers-platform/posts/api/dto/create-post-for-blog.dto';
import { UpdatePostDto } from '@modules/bloggers-platform/posts/api/dto/update-post.dto';

@Injectable()
class PostsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async create(dto: CreatePostDto): Promise<PostsEntity> {
    await this.blogQueryRepository.findOrNotFoundFail(dto.blogId);

    const query = `INSERT INTO "Posts"  ( "title", "shortDescription", "content", "blogId") VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [dto.title, dto.shortDescription, dto.content, dto.blogId];
    const [createdPost]: PostsEntity[] = await this.dataSource.query(query, values);
    const joinQuery = `
      SELECT
        p."id",
        p."title",
        p."shortDescription",
        p."content",
        p."blogId",
        p."createdAt",
        b."name" as "blogName"
      FROM "Posts" p
      JOIN "Blogs" b on b."id" = p."blogId"
      WHERE p."id" = $1
    `;
    const [postWithBlog]: PostsEntity[] = await this.dataSource.query(joinQuery, [createdPost.id]);
    return postWithBlog;
  }

  async createForBlog(dto: CreatePostForBlogDto, blogId: string): Promise<PostsEntity> {
    await this.blogQueryRepository.findOrNotFoundFail(blogId);
    const query = `INSERT INTO "Posts" ("title", "shortDescription", "content", "blogId") VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [dto.title, dto.shortDescription, dto.content, blogId];
    const [createdPost]: PostsEntity[] = await this.dataSource.query(query, values);
    const joinQuery = `
      SELECT
        p."id",
        p."title",
        p."shortDescription",
        p."content",
        p."blogId",
        p."createdAt",
        b."name" as "blogName"
      FROM "Posts" p
      JOIN "Blogs" b on b."id" = p."blogId"
      WHERE p."id" = $1
    `;
    const [postWithBlog]: PostsEntity[] = await this.dataSource.query(joinQuery, [createdPost.id]);
    return postWithBlog;
  }

  async update(id: string, dto: UpdatePostDto, blogId: string): Promise<boolean> {
    const query = `
    UPDATE "Posts" 
    SET "title" = $2, 
        "shortDescription" = $3, 
        "content" = $4, 
        "blogId" = $5 
    WHERE "id" = $1 
    RETURNING *`;

    const values = [id, dto.title, dto.shortDescription, dto.content, blogId];
    const updatedPost: PostsEntity[] = await this.dataSource.query(query, values);
    return updatedPost.length > 0;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM "Posts" WHERE "id" = $1 RETURNING *`;
    const values = [id];
    const result: PostsEntity[] = await this.dataSource.query(query, values);
    return result.length > 0;
  }

  async deleteAll() {
    const query = `DELETE FROM "Posts"`;
    await this.dataSource.query(query);
  }
}

export default PostsRepository;
