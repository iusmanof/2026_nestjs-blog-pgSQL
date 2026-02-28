import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../domain/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  async findByDeviceId(deviceId: string): Promise<SessionEntity | null> {
    const query = `SELECT * FROM "Session" WHERE "deviceId" = $1 LIMIT 1`;
    const values = [deviceId];
    const result: SessionEntity[] = await this.dataSource.query(query, values);
    return result.length ? result[0] : null;
  }
  //
  async findByUserId(userId: string): Promise<SessionEntity[]> {
    const query = `SELECT * FROM "Session" WHERE "userId" = $1`;
    const values = [userId];

    return await this.dataSource.query(query, values);
  }

  async createSession(dto: {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    refreshTokenHash: string;
    lastActiveDate: Date;
    expiresAt: Date;
  }): Promise<SessionEntity | null> {
    const query = `INSERT INTO "Session" (
        "userId",
        "deviceId",
        "ip",
        "title",
        "refreshTokenHash",
        "lastActiveDate",
        "expiresAt"
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING *
      `;
    const values = [
      dto.userId,
      dto.deviceId,
      dto.ip,
      dto.title,
      dto.refreshTokenHash,
      dto.lastActiveDate,
      dto.expiresAt,
    ];
    const result: SessionEntity[] = await this.dataSource.query(query, values);
    return result.length ? result[0] : null;
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
      // помечаем сессию как взломанную
      const revokeQuery = `
        UPDATE "Session"
        SET "isRevoked" = true
        WHERE "deviceId" = $1
      `;
      await this.dataSource.query(revokeQuery, [deviceId]);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    // обновляем токен и даты
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

  async deleteByDeviceId(deviceId: string): Promise<void> {
    const query = `DELETE FROM "Session" where "deviceId" = $1;`;
    const values = [deviceId];
    await this.dataSource.query(query, values);
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
    const query = `DELETE FROM "Session"`;
    await this.dataSource.query(query);
  }
}
