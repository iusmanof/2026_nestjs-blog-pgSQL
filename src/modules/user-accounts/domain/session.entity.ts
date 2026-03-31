import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';
import bcrypt from 'bcrypt';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

@Entity({ name: 'Session' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column('uuid')
  userId: string;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 45 })
  ip: string;

  @Column({ type: 'varchar', length: 255 })
  refreshTokenHash: string;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActiveDate: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  static async createNewSession(params: {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    refreshToken: string;
    iat: number;
    exp: number;
  }): Promise<SessionEntity> {
    const session = new SessionEntity();

    session.userId = params.userId;
    session.deviceId = params.deviceId;
    session.ip = params.ip;
    session.title = params.title;
    session.refreshTokenHash = await bcrypt.hash(params.refreshToken, 10);
    session.lastActiveDate = new Date(params.iat * 1000);
    session.expiresAt = new Date(params.exp * 1000);
    session.isRevoked = false;

    return session;
  }

  isExpired() {
    return this.expiresAt < new Date();
  }

  isRefreshTokenUsed(iat: Date) {
    return this.lastActiveDate.toISOString() !== iat.toISOString();
  }
  verifyRefreshToken(iat: Date) {
    if (this.isRevoked || this.isRefreshTokenUsed(iat)) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token already used',
      });
    }
  }
  getRefreshTokenHash(): string {
    return this.refreshTokenHash;
  }

  markRevoked() {
    this.isRevoked = true;
  }
}
