import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../infrastructure/session.repository';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';

export class DeleteAllDevicesCommand {
  constructor(public readonly refreshToken: string) {}
}
@CommandHandler(DeleteAllDevicesCommand)
export class DeleteAllDevicesUseCase implements ICommandHandler<DeleteAllDevicesCommand> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwt: JwtService,
    private readonly config: UserAccountsConfig,
  ) {}

  async execute(command: DeleteAllDevicesCommand): Promise<void> {
    let payload: { userId: string; deviceId: string };

    try {
      payload = this.refreshJwt.verify(command.refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }

    // удалить ВСЕ устройства пользователя кроме текущего
    await this.sessionRepository.deleteAllExceptCurrent(payload.userId, payload.deviceId);
  }
}
