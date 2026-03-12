import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { UsersEntity } from '@user-accounts/domain/users.entity';
import type { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';

@Entity('PostLikes')
@Unique(['postId', 'userId'])
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
}
