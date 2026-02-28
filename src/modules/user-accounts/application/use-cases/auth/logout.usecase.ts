import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { SessionRepository } from '../../../infrastructure/session.repository';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';

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
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token not found',
      });
    }

    let payload: { userId: string; deviceId: string; iat: number };

    try {
      payload = this.refreshJwt.verify(refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid or expired refresh token',
      });
    }

    const session = await this.sessionRepository.findByDeviceId(payload.deviceId);

    if (!session || session.userId !== payload.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Session not found',
      });
    }

    // КРИТИЧНО: проверка iat === lastActiveDate
    const tokenIatDate = new Date(payload.iat * 1000);

    if (session.lastActiveDate.toISOString() !== tokenIatDate.toISOString()) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token already used',
      });
    }

    await this.sessionRepository.revokeSession(payload.deviceId);
    await this.sessionRepository.deleteByDeviceId(payload.deviceId);
  }
}
