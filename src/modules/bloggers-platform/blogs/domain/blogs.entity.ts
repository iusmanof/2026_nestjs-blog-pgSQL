import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { CreateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/create-blog.dto';
import { UpdateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/update-blog.dto';

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

  @Index()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isMembership: boolean;

  @OneToMany(() => PostsEntity, (post) => post.blog)
  posts: PostsEntity[];

  static create(dto: CreateBlogDto) {
    const blog = new BlogsEntity();

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;

    blog.validateBlog();
    return blog;
  }

  changeDetails(dto: UpdateBlogDto) {
    if (dto.name) this.name = dto.name;
    if (dto.description) this.description = dto.description;
    if (dto.websiteUrl) this.websiteUrl = dto.websiteUrl;
    this.validateBlog();
  }

  delete() {
    if (this.isMembership) {
      throw new Error('Cannot delete membership blog');
    }
  }

  private validateBlog() {
    if (!this.name || this.name.length < 1) {
      throw new Error('Name cannot be empty');
    }
  }

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getWebsiteUrl() {
    return this.websiteUrl;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getIsMembership() {
    return this.isMembership;
  }
}
