import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserContextDto } from '../dto/user-context.dto';

@Injectable()
export class ValidateUserService {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async validate(loginOrEmail: string, password: string): Promise<UserContextDto | null> {
    const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);

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
