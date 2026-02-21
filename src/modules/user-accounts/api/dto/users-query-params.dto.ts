import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.dto';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class UsersQueryParamsDto extends BaseQueryParams {
  @IsEnum(UsersSortBy)
  @IsOptional()
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchLoginTerm?: string;

  @IsString()
  @IsOptional()
  searchEmailTerm?: string;
}
