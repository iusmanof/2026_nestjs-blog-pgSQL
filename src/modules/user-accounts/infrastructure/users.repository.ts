import { Injectable } from '@nestjs/common';
import { UserDbType } from '../domain/user-db.type';

@Injectable()
class UsersRepository {
  constructor() {
    // @InjectModel(User.name)
    // private readonly userModel: UserModelType,
  }

  create(dto: UserDbType) {
    console.log(dto);
  }

  delete(id: string): boolean {
    console.log(id);
    return true;
  }

  async deleteAll() {}

  async save() {}

  // create(dto: UserDbType): UserDocument {
  //   const createDto: CreateUserDto = {
  //     login: dto.login,
  //     email: dto.email,
  //     password: dto.passwordHash,
  //   };
  //   return this.userModel.createInstance(createDto);
  // }
  //
  // async delete(id: string): Promise<boolean> {
  //   const result = await this.userModel.deleteOne({ _id: id });
  //   return result.deletedCount === 1;
  // }
  //
  // async deleteAll() {
  //   await this.userModel.deleteMany({});
  // }
  //
  // async save(user: UserDocument) {
  //   await user.save();
  // }
}

export default UsersRepository;
