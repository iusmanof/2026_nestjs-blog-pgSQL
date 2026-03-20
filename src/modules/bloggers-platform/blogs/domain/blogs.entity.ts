import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { CreateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/create-blog.dto';
import { UpdateBlogDto } from '@modules/bloggers-platform/blogs/api/dto/update-blog.dto';
import { RawEntityDto } from '@modules/bloggers-platform/blogs/domain/RawEntity.dto';

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

  // fabric
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
  static restore(raw: RawEntityDto): BlogsEntity {
    const blog = new BlogsEntity();

    blog.id = raw.id;
    blog.name = raw.name;
    blog.description = raw.description;
    blog.websiteUrl = raw.websiteUrl;
    blog.createdAt = raw.createdAt;
    blog.isMembership = raw.isMembership;

    return blog;
  }

  update(dto: UpdateBlogDto) {
    if (dto.name) this.name = dto.name;
    if (dto.description) this.description = dto.description;
    if (dto.websiteUrl) this.websiteUrl = dto.websiteUrl;
    this.validateBlog();
  }

  // invariant
  private validateBlog() {
    if (!this.name || this.name.length < 1) {
      throw new Error('Name cannot be empty');
    }
  }

  // getters
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
