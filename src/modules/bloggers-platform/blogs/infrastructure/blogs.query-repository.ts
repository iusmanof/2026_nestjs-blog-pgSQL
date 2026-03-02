import { Injectable } from '@nestjs/common';
import { BlogsEntity } from '@modules/bloggers-platform/blogs/domain/blogs.entity';
import { DomainException, Extension } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsQueryParamsDto } from '@modules/bloggers-platform/blogs/api/dto/blogs-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { Blog, BlogDocument } from '../domain/blogs.entity';
// import { Model } from 'mongoose';
// import { BlogViewDto } from '../api/dto/blog-view.dto';
// import { BlogPaginatedViewDto } from '../api/dto/blog-paginated.view.dto';
// import { SortDirection } from '../../../../../../2026_nestjs-blog-pgSQL/src/core/dto/base.query-params.dto';
// import { BlogsQueryParamsDto } from '../api/dto/blogs-query-params.dto';
// import {
//   DomainException,
//   Extension,
// } from '../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../../../2026_nestjs-blog-pgSQL/src/core/exceptions/filters/domain-exception-codes';

@Injectable()
class BlogQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: BlogsQueryParamsDto) {
    // Берем все блоги из базы
    const allBlogs: BlogsEntity[] = await this.dataSource.query(
      `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership" FROM "Blogs"`,
    );

    // Фильтрация по имени
    const filtered = allBlogs.filter((blog) =>
      query.searchNameTerm
        ? blog.name.toLowerCase().includes(query.searchNameTerm.toLowerCase())
        : true,
    );

    // Настройка сортировки
    const sortField = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDirection === SortDirection.Asc ? 1 : -1;

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Если сортируем по строке, сравниваем по регистру (для теста)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return -1 * sortDir;
        if (aValue > bValue) return 1 * sortDir;
        return 0;
      }

      // Для других типов
      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortDir;
    });

    // Пагинация
    const totalCount = filtered.length;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const start = (query.pageNumber - 1) * query.pageSize;
    const items = filtered.slice(start, start + query.pageSize);

    return {
      items,
      totalCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      pagesCount,
    };
  }

  //
  // // TODO вынести NotFoundException и mapToView выше на уровень
  // async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
  //   const entity = await this.blogModel.findById(id);
  //
  //   if (!entity) {
  //     throw new DomainException({
  //       code: DomainExceptionCode.NotFound,
  //       message: 'Blog not found',
  //       extensions: [new Extension('Blog with given id does not exist', 'id')],
  //     });
  //   }
  //   return BlogViewDto.mapToView(entity);
  // }

  async findOrNotFoundFail(id: string): Promise<BlogsEntity> {
    const query = `SELECT * FROM "Blogs" WHERE id = $1`;
    const values = [id];
    const entity: BlogsEntity[] = await this.dataSource.query(query, values);
    if (!entity.length) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Blog not found',
        extensions: [new Extension('Blog with given id does not exist', 'id')],
      });
    }
    return entity[0];
  }
}

export default BlogQueryRepository;
