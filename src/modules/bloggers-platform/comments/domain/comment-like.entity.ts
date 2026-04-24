import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import type { LikeStatus } from '@modules/bloggers-platform/posts/types/like-status.type';
import { UsersEntity } from '@user-accounts/domain/users.entity';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';

@Entity({ name: 'CommentLikes' })
@Unique(['commentId', 'userId'])
export class CommentLikesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  status: LikeStatus;

  @ManyToOne(() => CommentsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: CommentsEntity;

  @Column({ type: 'uuid' })
  commentId: string;

  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column({ type: 'uuid' })
  userId: string;
}
