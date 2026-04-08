import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

@Injectable()
class PostsRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async save(post: PostsEntity): Promise<PostsEntity> {
    return await this.dataSource.getRepository(PostsEntity).save(post);
  }

  async findById(id: string): Promise<PostsEntity | null> {
    return await this.dataSource.getRepository(PostsEntity).findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.getRepository(PostsEntity).delete({ id: id });
  }

  async deleteAll(): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from('Posts').execute();
  }

  async deleteAllPostLikes(): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from('PostLikes').execute();
  }

  // TODO use TypeORM
  async setLikeStatus(userId: string, postId: string, status: LikeStatus): Promise<void> {
    const query = `
    INSERT INTO "PostLikes" ("postId","userId","status")
    VALUES ($1,$2,$3)
    ON CONFLICT ("postId","userId")
    DO UPDATE SET "status" = EXCLUDED."status"
  `;

    await this.dataSource.query(query, [postId, userId, status]);
  }
}

export default PostsRepository;
