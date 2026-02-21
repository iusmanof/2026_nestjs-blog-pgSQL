import { Injectable } from '@nestjs/common';
import { UsersQueryParamsDto } from '../api/dto/users-query-params.dto';
// import { UserPaginatedViewDto } from '../api/dto/user-paginated.view.dto';
// import { UserViewDto } from '../api/dto/user-view.dto';
// import { SortDirection } from '../../../core/dto/base.query-params.dto';

@Injectable()
export class UsersQueryRepository {
  constructor() {
    // @InjectModel(User.name)
    // private readonly userModel: Model<UserDocument>,
  }

  getAll(query: UsersQueryParamsDto) {
    console.log(query);
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
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // // const totalCount = await this.userModel.countDocuments(filter);
    //
    // const sortField = query.sortBy || 'createdAt';
    // const sortOrder = query.sortDirection === SortDirection.Asc ? 1 : -1;
    //
    // const users = await this.userModel
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
