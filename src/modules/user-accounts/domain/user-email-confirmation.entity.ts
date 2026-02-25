import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({ name: 'UserEmailConfirmations' })
export class UserEmailConfirmationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.emailConfirmations, { onDelete: 'CASCADE' })
  user: UsersEntity;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
