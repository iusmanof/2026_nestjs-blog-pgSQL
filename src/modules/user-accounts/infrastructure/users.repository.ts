import { Injectable } from '@nestjs/common';
import { UserDbType } from '../types/user-db.type';
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

  async delete(id: string): Promise<void> {
    const query = `
          DELETE FROM "Users"
          WHERE id = $1;
      `;

    await this.dataSource.query(query, [id]);
  }

  async updatePasswordHash(params: { id: string; passwordHash: string }): Promise<void> {
    const query = `UPDATE "Users" SET passwordHash = $2 WHERE id = $1`;
    const values = [params.id];
    await this.dataSource.query(query, values);
  }
  // TODO delete if not necessary
  async save(user: UsersEntity): Promise<UsersEntity> {
    const query = `
    UPDATE "Users"
    SET
      login = $1,
      email = $2,
      "passwordHash" = $3
    WHERE id = $4
    RETURNING *;
  `;
    const values = [user.login, user.email, user.passwordHash, user.id];
    const result: UsersEntity[] = await this.dataSource.query(query, values);
    return result[0];
  }

  async deleteAll() {
    const query = `DELETE FROM  "Users"`;
    await this.dataSource.query(query);
  }
}

export default UsersRepository;
