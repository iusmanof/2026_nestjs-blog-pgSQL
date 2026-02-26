import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from './session.entity';
import { UserEmailConfirmationEntity } from './user-email-confirmation.entity';

@Entity({ name: 'Users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  //@PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => UserEmailConfirmationEntity, (confirmation) => confirmation.user)
  emailConfirmations: UserEmailConfirmationEntity[];
}
