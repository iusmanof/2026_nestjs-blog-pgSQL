import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { CommentsEntity } from '@modules/bloggers-platform/comments/domain/comment.entity';
import { CreatePostForBlogDto } from '@modules/bloggers-platform/posts/api/dto/create-post-for-blog.dto';
import { UpdatePostDto } from '@modules/bloggers-platform/posts/api/dto/update-post.dto';

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

  static create(params: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
  }) {
    const post = new PostsEntity();

    post.title = params.title;
    post.shortDescription = params.shortDescription;
    post.content = params.content;
    post.blogId = params.blogId;
    post.createdAt = new Date();

    post.validatePost();
    return post;
  }

  static createPostForBlog({ dto, blogId }: { dto: CreatePostForBlogDto; blogId: string }) {
    const post = new PostsEntity();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId;
    post.createdAt = new Date();

    post.validatePost();
    return post;
  }

  changeDetails(dto: UpdatePostDto) {
    if (dto.title) this.title = dto.title;
    if (dto.shortDescription) this.shortDescription = dto.shortDescription;
    if (dto.content) this.content = dto.content;
    this.validatePost();
  }

  delete(commentsCount: number) {
    if (commentsCount > 0) {
      throw new Error('Comments must be empty');
    }
  }

  // invariant
  private validatePost() {
    if (!this.title || this.title.length < 1) {
      throw new Error('Title cannot be empty');
    }
  }

  // getters
  getTitle() {
    return this.title;
  }

  getShortDescription() {
    return this.shortDescription;
  }

  getContent() {
    return this.content;
  }
  getId() {
    return this.id;
  }
}
