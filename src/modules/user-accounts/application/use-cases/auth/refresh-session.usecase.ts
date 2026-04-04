import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import SessionRepository from '../../../infrastructure/session.repository';
import { RefreshSession } from '../../../types/refresh-session.type';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';

export class RefreshSessionCommand {
  constructor(public readonly refreshToken: string | undefined) {}
}

@CommandHandler(RefreshSessionCommand)
export class RefreshSessionUseCase implements ICommandHandler<RefreshSessionCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessJwt: JwtService,

    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwt: JwtService,

    private readonly config: UserAccountsConfig,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: RefreshSessionCommand): Promise<RefreshSession> {
    // check token
    if (!command.refreshToken) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token not found',
      });
    }

    // verify token
    let payload: { deviceId: string; userId: string };
    try {
      payload = this.refreshJwt.verify(command.refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid or expired refresh token',
      });
    }

    // take out session
    const session = await this.sessionRepository.findByDeviceId(payload.deviceId);

    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Session not found',
      });
    }

    session?.assertOwnership(payload.userId);

    // take out iat and exp
    const decoded = this.refreshJwt.decode<{ iat: number; exp: number }>(command.refreshToken);

    if (
      !decoded?.iat ||
      !decoded?.exp ||
      session.isRefreshTokenUsed(new Date(decoded.iat * 1000))
    ) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token already used or invalid',
      });
    }

    const user = await this.usersQueryRepository.findById(session.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    const iatDate = new Date(decoded.iat * 1000);
    const expDate = new Date(decoded.exp * 1000);

    // generate new refresh token
    const newRefreshToken: string = this.refreshJwt.sign({
      userId: user.userId,
      deviceId: session.deviceId,
    });
    const newDecoded: { iat: number; exp: number } = this.refreshJwt.decode(newRefreshToken);

    const newIat = new Date(newDecoded.iat * 1000);
    const newExp = new Date(newDecoded.exp * 1000);

    await session.useRefreshToken({
      oldRefreshToken: command.refreshToken,
      newRefreshToken: newRefreshToken,
      iat: iatDate,
      exp: expDate,
      newIat: newIat,
      newExp: newExp,
    });

    // save session
    await this.sessionRepository.save(session);

    // generate access token
    const accessToken = this.accessJwt.sign({ id: payload.deviceId });

    return { accessToken, newRefreshToken };
  }
}
