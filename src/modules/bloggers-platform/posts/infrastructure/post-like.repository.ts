import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikesEntity } from '@modules/bloggers-platform/posts/domain/post-likes.entity';

@Injectable()
class PostsLikesRepository {
  constructor(
    @InjectRepository(PostLikesEntity)
    private readonly repo: Repository<PostLikesEntity>,
  ) {}

  async find(userId: string, postId: string): Promise<PostLikesEntity | null> {
    return this.repo.findOne({
      where: { userId, postId },
    });
  }

  async save(entity: PostLikesEntity): Promise<void> {
    await this.repo.save(entity);
  }
}
export default PostsLikesRepository;
