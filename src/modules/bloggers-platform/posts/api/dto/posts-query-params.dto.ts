import { BaseQueryParams } from '@core/dto/base.query-params.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
  BlogName = 'blogName',
}

export class PostsQueryParamsDto extends BaseQueryParams {
  @IsEnum(PostsSortBy)
  @IsOptional()
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
}
