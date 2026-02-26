import { Injectable } from '@nestjs/common';
import { UsersQueryParamsDto, UsersSortBy } from '../api/dto/users-query-params.dto';
import { SortDirection } from '../../../core/dto/base.query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../domain/users.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: UsersQueryParamsDto) {
    const allUsers: UsersEntity[] = await this.dataSource.query(
      `SELECT id, login, email, "createdAt" FROM "Users"`,
    );

    const filtered = allUsers.filter((user) => {
      const loginMatch = query.searchLoginTerm
        ? user.login.toLowerCase().includes(query.searchLoginTerm.toLowerCase())
        : true;
      const emailMatch = query.searchEmailTerm
        ? user.email.toLowerCase().includes(query.searchEmailTerm.toLowerCase())
        : true;

      return loginMatch || emailMatch; // OR как требует тест
    });

    const sortFieldMap: Record<UsersSortBy, keyof UsersEntity> = {
      login: 'login',
      email: 'email',
      createdAt: 'createdAt',
    };
    const sortField = sortFieldMap[query.sortBy] ?? 'createdAt';

    filtered.sort((a, b) => {
      const dir = query.sortDirection === SortDirection.Asc ? 1 : -1;

      if (a[sortField] < b[sortField]) return -1 * dir;
      if (a[sortField] > b[sortField]) return 1 * dir;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const totalCount = filtered.length;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const start = query.calculateSkip();
    const items = filtered.slice(start, start + query.pageSize);

    return {
      items,
      totalCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      pagesCount,
    };
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersEntity | null> {
    console.log(loginOrEmail);
    const querySql = `SELECT * FROM "Users" WHERE login = $1 OR email = $1;`;
    const result: UsersEntity[] = await this.dataSource.query(querySql, [loginOrEmail]);
    return result[0] ?? null;
  }
  async findById(id: string): Promise<UsersEntity | null> {
    const query = `SELECT * FROM "Users" WHERE id = $1`;
    const values = [id];
    const result: UsersEntity[] = await this.dataSource.query(query, values);
    return result.length ? result[0] : null;
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    const query = `SELECT * FROM "Users" WHERE email = $1;`;
    const values = [email];
    const result: UsersEntity[] = await this.dataSource.query(query, values);
    return result[0] ?? null;
  }
}
