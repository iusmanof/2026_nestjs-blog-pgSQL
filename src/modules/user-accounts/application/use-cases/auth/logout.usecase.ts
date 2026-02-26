import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { SessionRepository } from '../../../infrastructure/session.repository';

export class LogoutCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwt: JwtService,
    private readonly config: UserAccountsConfig,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshToken } = command;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookie');
    }

    let payload: { userId: string; deviceId: string; iat: number };
    try {
      payload = this.refreshJwt.verify<{
        userId: string;
        deviceId: string;
        iat: number;
      }>(refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const session = await this.sessionRepository.findByDeviceId(payload.deviceId);
    if (!session || session.userId !== payload.userId) {
      throw new UnauthorizedException('Session not found');
    }
    const tokenIatDate = new Date(payload.iat * 1000);

    if (session.lastActiveDate.getTime() !== tokenIatDate.getTime()) {
      throw new UnauthorizedException();
    }

    // TODO use DDD
    await this.sessionRepository.revokeSession(payload.deviceId);

    await this.sessionRepository.deleteByDeviceId(payload.deviceId);
  }
}
