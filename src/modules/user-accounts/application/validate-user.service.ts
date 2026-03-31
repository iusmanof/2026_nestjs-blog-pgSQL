import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UserContextDto } from '../dto/user-context.dto';
import UsersRepository from '@user-accounts/infrastructure/users.repository';

@Injectable()
export class ValidateUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async validate(loginOrEmail: string, password: string): Promise<UserContextDto | null> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user?.passwordHash) {
      return null;
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id.toString(),
      login: user.login,
    };
  }
}
