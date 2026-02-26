export class MeViewDto {
  userId: string;
  email: string;
  login: string;

  static map(user: { id: string; email: string; login: string }): MeViewDto {
    return {
      userId: user.id,
      email: user.email,
      login: user.login,
    };
  }
}
