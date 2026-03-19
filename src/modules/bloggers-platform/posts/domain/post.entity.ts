import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';

@Entity({ name: 'Posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  shortDescription: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => BlogsEntity, (blog) => blog.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: BlogsEntity;

  @Column({ type: 'uuid' })
  blogId: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => CommentsEntity, (comment) => comment.post)
  comments: CommentsEntity[];
}
