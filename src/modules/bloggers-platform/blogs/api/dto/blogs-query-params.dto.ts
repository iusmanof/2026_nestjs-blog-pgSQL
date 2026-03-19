import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '@core/dto/base.query-params.dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class BlogsQueryParamsDto extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  @IsOptional()
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm?: string;
}
