import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEmailConfirmationEntity } from '../domain/user-email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(params: {
    userId: string;
    code: string;
    expiresAt: Date;
  }): Promise<UserEmailConfirmationEntity> {
    const query = `
      INSERT INTO "UserEmailConfirmations"
        ("userId", "code", "isConfirmed", "expiresAt")
      VALUES ($1, $2, false, $3)
      RETURNING *;
    `;

    const values = [params.userId, params.code, params.expiresAt];

    const result: UserEmailConfirmationEntity[] = await this.dataSource.query(query, values);

    return result[0];
  }

  async updateCode(params: { userId: string; code: string; expiresAt: Date }) {
    const query = `
      UPDATE "UserEmailConfirmations"
      SET "code" = $2,
          "expiresAt" = $3,
          "isConfirmed" = $4
      WHERE "userId" = $1
    `;

    const values = [params.userId, params.code, params.expiresAt, false];

    await this.dataSource.query(query, values);
  }

  async completeConfirmation(id: string): Promise<void> {
    const query = `
      UPDATE "UserEmailConfirmations"
      SET "isConfirmed" = $1
      WHERE "id" = $2
    `;

    const values = [true, id];

    await this.dataSource.query(query, values);
  }

  // TODO create EmailConfirmationQueryRepository CQRS
  async findByUserId(userId: string): Promise<UserEmailConfirmationEntity | null> {
    const result: UserEmailConfirmationEntity[] = await this.dataSource.query(
      `SELECT * FROM "UserEmailConfirmations" WHERE "userId" = $1 LIMIT 1`,
      [userId],
    );

    return result[0] ?? null;
  }

  // TODO create EmailConfirmationQueryRepository CQRS
  async findByRecoveryCode(code: string): Promise<UserEmailConfirmationEntity | null> {
    const query = `SELECT * FROM "UserEmailConfirmations" WHERE "code" = $1 LIMIT 1`;
    const values = [code];
    const result: UserEmailConfirmationEntity[] = await this.dataSource.query(query, values);
    return result[0] ?? null;
  }

  async deleteAll(): Promise<void> {
    const query = `DELETE FROM "UserEmailConfirmations"`;
    await this.dataSource.query(query);
  }
}
