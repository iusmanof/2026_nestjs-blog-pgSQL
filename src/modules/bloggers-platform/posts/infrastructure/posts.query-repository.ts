import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '@modules/bloggers-platform/posts/domain/post.entity';
import { PostsQueryParamsDto } from '@modules/bloggers-platform/posts/api/dto/posts-query-params.dto';
import { SortDirection } from '@core/dto/base.query-params.dto';

@Injectable()
class PostsQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: PostsQueryParamsDto) {
    const sortField = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const pageSize = query.pageSize;
    const offset = query.calculateSkip();

    const totalCountResult: { count: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) FROM "Posts"`,
    );

    const totalCount = Number(totalCountResult[0].count);

    const allowedSortFields = ['createdAt', 'title', 'id'];

    const safeSortField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';

    const items: PostsEntity[] = await this.dataSource.query(
      `
      SELECT *
      FROM "Posts"
      ORDER BY "${safeSortField}" ${sortDirection}
      LIMIT $1
      OFFSET $2
      `,
      [pageSize, offset],
    );

    return {
      totalCount,
      items,
    };
  }

  async findByIdWithRequestingUser(
    postId: string,
    currentUserId?: string,
  ): Promise<PostsEntity | null> {
    const query = `SELECT * FROM "Posts" WHERE id = $1`;
    const values = [postId];
    if (currentUserId) {
      console.log(currentUserId);
    }
    const result: PostsEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  // async getPostsForBlog(blogId: string, query: PostsQueryParamsDto) {
  //   await this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  //
  //   const filter = { blogId };
  //
  //   const totalCount = await this.postModel.countDocuments(filter);
  //
  //   const items = await this.postModel
  //     .find(filter)
  //     .sort({
  //       [query.sortBy]: query.sortDirection === SortDirection.Asc ? 1 : -1,
  //     })
  //     .skip(query.calculateSkip())
  //     .limit(query.pageSize);
  //   // .lean();
  //
  //   return {
  //     totalCount,
  //     items,
  //   };
  // }
  //
  // async findById(id: string): Promise<PostDocument | null> {
  //   return await this.postModel.findById(id).exec();
  // }
}

export default PostsQueryRepository;
