import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RestoreUserProps, UsersEntity } from '../domain/users.entity';
import { InsertUserRaw } from '@user-accounts/types/inser-user-raw.type';

@Injectable()
class UsersRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async save(entity: UsersEntity): Promise<UsersEntity> {
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into('Users')
      .values({
        login: entity.getLogin(),
        email: entity.getEmail(),
        passwordHash: entity.getPasswordHash(),
      })
      .returning(['id', 'login', 'email', 'createdAt'])
      .execute();

    const rawArray = result.raw as InsertUserRaw[];

    if (!rawArray.length) {
      throw new Error('Failed to insert user');
    }
    const raw = rawArray[0];

    return UsersEntity.restore({
      id: raw.id,
      login: raw.login,
      email: raw.email,
      createdAt: raw.createdAt,
    });
  }

  async findById(id: string): Promise<UsersEntity | null> {
    const result: RestoreUserProps | undefined = await this.dataSource
      .createQueryBuilder()
      .select(['u.id', 'u.login', 'u.email', 'u.createdAt'])
      .from('Users', 'u')
      .where('u.id = :id', { id })
      .getRawOne<RestoreUserProps>();

    if (!result) return null;
    return UsersEntity.restore(result);
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersEntity | null> {
    const result: RestoreUserProps | undefined = await this.dataSource
      .createQueryBuilder()
      .select(['u.id as id', 'u.login as login', 'u.email as email', 'u.createdAt as "createdAt"'])
      .from('Users', 'u')
      .where('u.login = :loginOrEmail', { loginOrEmail })
      .orWhere('u.email = :email', { email: loginOrEmail })
      .getRawOne<RestoreUserProps>();

    if (!result) return null;

    return UsersEntity.restore(result);
  }

  async delete(id: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('Users')
      .where('id = :id', { id })
      .execute();
  }

  async updatePasswordHash(params: { id: string; passwordHash: string }): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update('Users', 'u')
      .set({ passwordHash: params.passwordHash })
      .where('u.id = :id', { id: params.id })
      .execute();
  }

  async deleteAll() {
    await this.dataSource.createQueryBuilder().delete().from('Users').execute();
  }
}

export default UsersRepository;
