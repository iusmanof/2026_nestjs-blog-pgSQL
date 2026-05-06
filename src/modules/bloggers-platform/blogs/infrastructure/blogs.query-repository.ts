import { Injectable } from '@nestjs/common';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BlogsQueryParamsDto,
  BlogsSortBy,
} from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
import { BlogViewDto } from '@modules/bloggers-platform/blogs/api/dto/view/blog-view.dto';

@Injectable()
class BlogsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: BlogsQueryParamsDto) {
    const {
      searchNameTerm = null,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = query;

    const qb = this.dataSource
      .getRepository(BlogsEntity)
      .createQueryBuilder('blog')
      .select([
        'blog.id',
        'blog.name',
        'blog.description',
        'blog.websiteUrl',
        'blog.createdAt',
        'blog.isMembership',
      ]);

    if (searchNameTerm !== null) {
      qb.andWhere(`blog.name ILIKE :searchName`, {
        searchName: `%${searchNameTerm}%`,
      });
    }

    const direction = sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    if (sortBy === BlogsSortBy.Name) {
      qb.orderBy(`blog.${sortBy} COLLATE "C"`, direction);
    } else {
      qb.orderBy(`blog.${sortBy}`, direction);
    }

    const skip = (pageNumber - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    const [items, totalCount] = await qb.getManyAndCount();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async findById(id: string): Promise<BlogViewDto | null> {
    return await this.dataSource.getRepository(BlogsEntity).findOne({ where: { id: id } });
  }
}

export default BlogsQueryRepository;
