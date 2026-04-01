import { Injectable } from '@nestjs/common';
import { UsersQueryParamsDto, UsersSortBy } from '../api/dto/users-query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../domain/users.entity';
import { UserDataViewDto } from '@user-accounts/api/dto/user-data-view.dto';
import { UserRaw } from '@user-accounts/types/user-raw.type';
import { SortDirection } from '@core/dto/base.query-params.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: UsersQueryParamsDto) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm,
      searchEmailTerm,
    } = query;

    const qb = this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .select(['user.id', 'user.login', 'user.email', 'user.createdAt']);

    if (searchLoginTerm || searchEmailTerm) {
      qb.andWhere(
        `(
      user.login ILIKE :login
      OR user.email ILIKE :email
    )`,
        {
          login: `%${searchLoginTerm ?? ''}%`,
          email: `%${searchEmailTerm ?? ''}%`,
        },
      );
    }

    const direction = sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    if (sortBy === UsersSortBy.CreatedAt) {
      qb.orderBy(`user.${sortBy}`, direction);
    }
    if (sortBy === UsersSortBy.Login) {
      qb.orderBy(`user.${sortBy} COLLATE "C"`, direction);
    }
    if (sortBy === UsersSortBy.Email) {
      qb.orderBy(`user.${sortBy} COLLATE "C"`, direction);
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

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDataViewDto | null> {
    const result: UserRaw | undefined = await this.dataSource
      .createQueryBuilder()
      .select(['u.id as id', 'u.login as login', 'u.email as email', 'u.createdAt as "createdAt"'])
      .from('Users', 'u')
      .where('u.login = :loginOrEmail', { loginOrEmail })
      .orWhere('u.email = :email', { email: loginOrEmail })
      .getRawOne();

    if (!result) return null;

    return UserDataViewDto.map(result);
  }

  async findById(id: string): Promise<UserDataViewDto | null> {
    const result: UserRaw | undefined = await this.dataSource
      .createQueryBuilder()
      .select(['u.id as id', 'u.login as login', 'u.email as email', 'u.createdAt as "createdAt"'])
      .from('Users', 'u')
      .where('u.id = :id', { id })
      .getRawOne();

    if (!result) return null;

    return UserDataViewDto.map(result);
  }
}
