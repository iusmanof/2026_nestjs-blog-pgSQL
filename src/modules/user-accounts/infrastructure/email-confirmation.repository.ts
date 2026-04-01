import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEmailConfirmationEntity } from '../domain/user-email-confirmation.entity';

@Injectable()
class EmailConfirmationRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(params: { userId: string; code: string; expiresAt: Date }): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into('UserEmailConfirmations')
      .values({
        userId: params.userId,
        code: params.code,
        isConfirmed: false,
        expiresAt: params.expiresAt,
      })
      .execute();
  }

  async save(entity: UserEmailConfirmationEntity): Promise<void> {
    // insert and update
    await this.dataSource.getRepository(UserEmailConfirmationEntity).save(entity);
  }

  async findByUserId(userId: string): Promise<UserEmailConfirmationEntity | null> {
    return await this.dataSource
      .createQueryBuilder(UserEmailConfirmationEntity, 'u')
      .where('u.userId = :userId', { userId })
      .limit(1)
      .getOne();
  }

  async findByRecoveryCode(code: string): Promise<UserEmailConfirmationEntity | null> {
    return await this.dataSource
      .createQueryBuilder(UserEmailConfirmationEntity, 'u')
      .where('u.code = :code', { code })
      .limit(1)
      .getOne();
  }

  async deleteAll(): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from('UserEmailConfirmations').execute();
  }
}

export default EmailConfirmationRepository;
