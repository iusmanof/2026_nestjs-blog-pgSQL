import { Injectable } from '@nestjs/common';
import { UserDbType } from '../domain/user-db.type';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../domain/users.entity';

@Injectable()
class UsersRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async create(dto: UserDbType) {
    const query = `INSERT INTO "Users"(login, email, "passwordHash")
                   VALUES ( $1, $2, $3 ) 
                   RETURNING *;`;
    const values = [dto.login, dto.email, dto.passwordHash];
    const result: UsersEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const query = `
          DELETE FROM "Users"
          WHERE id = $1
              RETURNING id;
      `;

    const result: { id: number }[] = await this.dataSource.query(query, [id]);

    return result.length > 0;
  }

  async deleteAll() {
    const query = `DELETE FROM  "Users"`;
    await this.dataSource.query(query);
  }

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
