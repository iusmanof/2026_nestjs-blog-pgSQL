import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryParamsDto } from '../../../api/dto/users-query-params.dto';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import { UserPaginatedViewDto } from '../../../api/dto/user-paginated.view.dto';
import { UserViewDto } from '../../../api/dto/user-view.dto';

export class GetUsersQuery {
  constructor(public queryParams: UsersQueryParamsDto) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async execute(query: GetUsersQuery): Promise<UserPaginatedViewDto<UserViewDto>> {
    const { items, totalCount } = await this.usersQueryRepository.getAll(query.queryParams);

    return UserPaginatedViewDto.mapToView({
      items: items.map(UserViewDto.mapToView),
      page: query.queryParams.pageNumber,
      pageSize: query.queryParams.pageSize,
      totalCount,
    });
  }
}
