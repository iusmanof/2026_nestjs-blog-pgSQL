import { Injectable } from '@nestjs/common';
import { UsersQueryParamsDto, UsersSortBy } from '../api/dto/users-query-params.dto';
import { SortDirection } from '../../../core/dto/base.query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewDto } from '../api/dto/user-view.dto';
// import { UserPaginatedViewDto } from '../api/dto/user-paginated.view.dto';
// import { UserViewDto } from '../api/dto/user-view.dto';
// import { SortDirection } from '../../../core/dto/base.query-params.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async getAll(query: UsersQueryParamsDto) {
    const sortMap: Record<UsersSortBy, string> = {
      createdAt: `"createdAt"`,
      login: `login`,
      email: `email`,
    };

    const sortField = sortMap[query.sortBy] ?? `"createdAt"`;
    const sortDirection = query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

    const querySql = `
      SELECT id, login, email, "createdAt"
      FROM "Users"
      WHERE ($1::text IS NULL OR login = $1)
        AND ($2::text IS NULL OR email = $2)
      ORDER BY ${sortField} ${sortDirection}
      OFFSET $3
        LIMIT $4;
    `;

    const values = [
      query.searchLoginTerm ?? null,
      query.searchEmailTerm ?? null,
      query.calculateSkip(),
      query.pageSize,
    ];

    const items: UserViewDto[] = await this.dataSource.query(querySql, values);

    const countSql = `
    SELECT COUNT(*)::int AS count
    FROM "Users"
    WHERE ($1::text IS NULL OR login ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR email ILIKE '%' || $2 || '%');
  `;
    const result: { count: number }[] = await this.dataSource.query(countSql, [
      query.searchLoginTerm ?? null,
      query.searchEmailTerm ?? null,
    ]);

    const totalCount = result[0]?.count ?? 0;

    return { items, totalCount };
    // const filter: any = {};
    // const orConditions: any[] = [];
    //
    // if (query.searchLoginTerm) {
    //   orConditions.push({
    //     login: { $regex: query.searchLoginTerm, $options: 'i' },
    //   });
    // }
    //
    // if (query.searchEmailTerm) {
    //   orConditions.push({
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     email: { $regex: query.searchEmailTerm, $options: 'i' } as any,
    //   });
    // }
    //
    // if (orConditions.length > 0) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   filter.$or = orConditions;
    // }
    //
    // // const totalCount = await this.userModel.countDocuments(filter);
    //
    // const sortField = query.sortBy || 'createdAt';
    // const sortOrder = query.sortDirection === SortDirection.Asc ? 1 : -1;
    //
    // const users = await this.userModel
    //   .find(filter)
    //   .sort({ [sortField]: sortOrder, _id: 1 })
    //   .skip(query.calculateSkip())
    //   .limit(query.pageSize);
    //
    // const items = users.map(UserViewDto.mapToView);
    //
    // return UserPaginatedViewDto.mapToView<UserViewDto>({
    //   page: query.pageNumber,
    //   pageSize: query.pageSize,
    //   totalCount,
    //   items,
    // });
  }

  findByLoginOrEmail(loginOrEmail: string) /* Promise<UserDocument | null>*/ {
    console.log(loginOrEmail);
    // return this.userModel
    //   .findOne({
    //     $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    //   })
    //   .select('+passwordHash')
    //   .exec();
  }

  findByEmail(email: string) {
    console.log(email);
    // return this.userModel.findOne({ email }).exec();
  }

  findById(id: string) /* Promise<UserDocument | null>*/ {
    console.log(id);

    // return this.userModel.findOne({
    //   _id: id,
    //   deletedAt: null,
    // });
  }

  findByRecoveryCode(code: string) {
    console.log(code);
    // return this.userModel.findOne({ recoveryCode: code }).exec();
  }

  findByConfirmationCode(code: string) {
    console.log(code);
    // return this.userModel.findOne({ 'emailConfirmation.code': code }).exec();
  }
}
