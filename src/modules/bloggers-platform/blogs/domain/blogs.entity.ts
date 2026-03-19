import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';

@Entity({ name: 'Blogs' })
export class BlogsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  websiteUrl: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isMembership: boolean;

  @OneToMany(() => PostsEntity, (post) => post.blog)
  posts: PostsEntity[];
}
