import { UsersEntity } from '../../domain/users.entity';

export class UserViewDto {
  id: number;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView = (user: UsersEntity): UserViewDto => {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  };
}
