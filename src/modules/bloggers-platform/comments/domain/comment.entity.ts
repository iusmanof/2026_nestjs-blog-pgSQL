import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

@Entity({ name: 'Comments' })
export class CommentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  userLogin: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  dislikesCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => PostsEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostsEntity;

  @Column({ type: 'uuid' })
  postId: string;

  static create(params: { postId: string; userId: string; login: string; content: string }) {
    const comment = new CommentsEntity();

    comment.content = params.content;
    comment.postId = params.postId;
    comment.userId = params.userId;
    comment.userLogin = params.login;
    comment.createdAt = new Date();

    return comment;
  }
}
