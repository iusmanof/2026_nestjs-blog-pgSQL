import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../domain/session.entity';

@Injectable()
class SessionQueryRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    return await this.dataSource
      .createQueryBuilder()
      .select(['s.deviceId', 's.title', 's.ip', 's.lastActiveDate'])
      .from(SessionEntity, 's')
      .where('s.userId = :userId', { userId })
      .andWhere('s.isRevoked = false')
      .getMany();
  }
}

export default SessionQueryRepository;
