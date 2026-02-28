import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({ name: 'Session' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
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

  // TODO DDD
  static createNewSession(params: {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    refreshTokenHash: string;
    lastActiveDate: Date;
    expiresAt: Date;
  }): SessionEntity {
    const session = new SessionEntity();

    session.userId = params.userId;
    session.deviceId = params.deviceId;
    session.ip = params.ip;
    session.title = params.title;
    session.refreshTokenHash = params.refreshTokenHash;
    session.lastActiveDate = params.lastActiveDate;
    session.expiresAt = params.expiresAt;
    session.isRevoked = false;
    return session;
  }
}
