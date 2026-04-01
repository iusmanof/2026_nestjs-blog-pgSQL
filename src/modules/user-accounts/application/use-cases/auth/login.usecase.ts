import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants/auth-tokens.inject-constants';
import { LoginMeta } from '../../../decorators/login-meta.decarator';
import { RefreshTokenPayload } from '../../../types/refresh-token-payload.type';
import SessionRepository from '../../../infrastructure/session.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { SessionEntity } from '@user-accounts/domain/session.entity';

export class LoginCommand {
  constructor(
    public readonly userId: string,
    public readonly meta: LoginMeta,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwt: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwt: JwtService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string; refreshToken: string }> {
    const deviceId = randomUUID();

    const accessToken = this.accessJwt.sign({ id: command.userId });
    const refreshToken = this.refreshJwt.sign({
      userId: command.userId,
      deviceId,
    });

    let decoded: RefreshTokenPayload;
    try {
      decoded = this.refreshJwt.verify(refreshToken);
    } catch {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid refresh token',
      });
    }

    const session = await SessionEntity.createNewSession({
      userId: command.userId,
      deviceId: deviceId,
      ip: command.meta.ip,
      title: command.meta.userAgent,
      refreshToken: refreshToken,
      iat: decoded.iat,
      exp: decoded.exp,
    });

    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
    };
  }
}
