export class UserDataViewDto {
  userId: string;
  email: string;
  login: string;

  static map(user: { id: string; email: string; login: string }): UserDataViewDto {
    return {
      userId: user.id,
      email: user.email,
      login: user.login,
    };
  }
}
