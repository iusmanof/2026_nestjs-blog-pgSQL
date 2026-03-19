import { BaseQueryParams } from '@core/dto/base.query-params.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}

export class CommentsQueryParamsDto extends BaseQueryParams {
  @IsEnum(CommentsSortBy)
  @IsOptional()
  sortBy: CommentsSortBy = CommentsSortBy.CreatedAt;
}
