import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../domain/session.entity';

@Injectable()
class SessionRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  async findByDeviceId(deviceId: string): Promise<SessionEntity | null> {
    return await this.dataSource
      .createQueryBuilder(SessionEntity, 's')
      .where('s.deviceId = :deviceId', { deviceId })
      .getOne();
  }

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    return await this.dataSource
      .createQueryBuilder()
      .select(['s.deviceId', 's.title', 's.ip', 's.lastActiveDate'])
      .from(SessionEntity, 's')
      .where('s.userId = :userId', { userId })
      .andWhere('s.isRevoked = false')
      .getMany();
  }

  async save(session: SessionEntity): Promise<void> {
    await this.dataSource.getRepository(SessionEntity).save(session);
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(SessionEntity)
      .where('deviceId = :deviceId', { deviceId })
      .execute();
  }

  async deleteAllExceptCurrent(userId: string, deviceId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update('Session')
      .set({ isRevoked: true })
      .where('userId = :userId', { userId })
      .andWhere('deviceId != :deviceId', { deviceId })
      .execute();
  }

  async deleteAll(): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from('Session').execute();
  }
}

export default SessionRepository;
