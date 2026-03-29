import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { SessionEntity } from './session.entity';
import { UserEmailConfirmationEntity } from './user-email-confirmation.entity';
import { CreateUserEntityDto } from '@user-accounts/domain/dto/create-user-entity.dto';
import { BaseCustomEntity } from '@core/typeorm/base.entity';

export interface RestoreUserProps {
  id: string;
  email: string;
  login: string;
  createdAt: Date;
}

@Entity({ name: 'Users' })
export class UsersEntity extends BaseCustomEntity {
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

  static create(params: CreateUserEntityDto) {
    const user = new UsersEntity();

    user.login = params.login;
    user.email = params.email;
    user.passwordHash = params.passwordHash;

    user.validate();
    return user;
  }

  delete() {}
  private validate() {
    if (!this.login || this.login.length < 2) {
      throw new Error('invalid login');
    }
  }

  static restore(props: RestoreUserProps) {
    const user = new UsersEntity();

    user.id = props.id;
    user.login = props.login;
    user.email = props.email;
    user.createdAt = props.createdAt;

    return user;
  }

  getId() {
    return this.id;
  }

  getLogin() {
    return this.login;
  }

  getEmail() {
    return this.email;
  }

  getPasswordHash() {
    return this.passwordHash;
  }
}
