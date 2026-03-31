import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

@Entity({ name: 'UserEmailConfirmations' })
export class UserEmailConfirmationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.emailConfirmations)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column()
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  updateRecoveryCode(code: string, expiresAt: Date) {
    this.code = code;
    this.expiresAt = expiresAt;
    this.isConfirmed = false;
  }

  isExpired() {
    return this.expiresAt < new Date();
  }

  confirmRecovery(code: string) {
    if (this.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Code already used',
      });
    }

    if (this.code !== code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid recovery code',
      });
    }

    if (this.isExpired()) {
      throw new DomainException({
        code: DomainExceptionCode.PasswordRecoveryCodeExpired,
        message: 'Recovery code expired',
      });
    }

    this.isConfirmed = true;
  }

  confirmEmail(code: string) {
    if (this.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ field: 'code', message: 'Email already confirmed' }],
      });
    }

    if (this.code !== code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      });
    }

    if (this.isExpired()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code expired',
        extensions: [{ field: 'code', message: 'Confirmation code expired' }],
      });
    }

    this.isConfirmed = true;
  }

  generateNewCode(): string {
    if (this.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
      });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 минут

    this.code = newCode;
    this.expiresAt = expiresAt;
    this.isConfirmed = false;

    return newCode;
  }
}
