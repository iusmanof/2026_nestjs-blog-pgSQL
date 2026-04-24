import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { UsersEntity } from '@user-accounts/domain/users.entity';
import type { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

@Index(['userId', 'postId'])
@Entity('PostLikes')
export class PostLikesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @ManyToOne(() => PostsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostsEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column({
    type: 'enum',
    enum: ['Like', 'Dislike', 'None'],
  })
  status: LikeStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  static create(userId: string, postId: string, status: LikeStatus) {
    const like = new PostLikesEntity();
    like.userId = userId;
    like.postId = postId;
    like.status = status;
    like.addedAt = new Date();
    return like;
  }

  changeStatus(status: LikeStatus) {
    this.status = status;
  }
}
