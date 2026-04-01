import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
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
    // return this.dataSource
    //   .getRepository(SessionEntity)
    //   .createQueryBuilder('session')
    //   .where('session.deviceId = :deviceId', { deviceId })
    //   .getOne();
  }

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    const query = `SELECT * FROM "Session" WHERE "userId" = $1`;
    const values = [userId];

    return await this.dataSource.query(query, values);
  }

  async save(session: SessionEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into('Session')
      .values({
        userId: session.userId,
        deviceId: session.deviceId,
        ip: session.ip,
        title: session.title,
        refreshTokenHash: session.refreshTokenHash,
        lastActiveDate: session.lastActiveDate,
        expiresAt: session.expiresAt,
        isRevoked: session.isRevoked,
      })
      .execute();
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('Session')
      .where('deviceId = :deviceId', { deviceId })
      .execute();
  }

  async useRefreshToken(
    deviceId: string,
    oldRefreshToken: string,
    newRefreshHash: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ): Promise<void> {
    // получаем сессию
    const session = await this.findByDeviceId(deviceId);
    if (!session) throw new UnauthorizedException('Session not found');

    const isValid = await bcrypt.compare(oldRefreshToken, session.refreshTokenHash);
    if (!isValid) {
      const revokeQuery = `
        UPDATE "Session"
        SET "isRevoked" = true
        WHERE "deviceId" = $1
      `;
      await this.dataSource.query(revokeQuery, [deviceId]);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const updateQuery = `
      UPDATE "Session"
      SET "refreshTokenHash" = $1,
          "lastActiveDate" = $2,
          "expiresAt" = $3,
          "isRevoked" = false
      WHERE "deviceId" = $4
    `;
    const values = [newRefreshHash, lastActiveDate, expiresAt, deviceId];
    await this.dataSource.query(updateQuery, values);
  }

  async revokeSession(deviceId: string): Promise<void> {
    const query = `
      UPDATE "Session"
      SET "isRevoked" = true
      WHERE "deviceId" = $1
    `;
    await this.dataSource.query(query, [deviceId]);
  }

  async deleteAllExceptCurrent(userId: string, deviceId: string) {
    const query = `
    DELETE FROM "Session"
    WHERE "userId" = $1
      AND "deviceId" != $2
  `;
    const values = [userId, deviceId];
    await this.dataSource.query(query, values);
  }

  async deleteAll(): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from('Session').execute();
  }
}

export default SessionRepository;
