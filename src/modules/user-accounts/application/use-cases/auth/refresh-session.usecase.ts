import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import { SessionRepository } from '../../../infrastructure/session.repository';
import { RefreshSession } from '../../../types/refresh-session.type';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

export class RefreshSessionCommand {
  constructor(public readonly refreshToken: string) {}
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
    const { refreshToken } = command;

    if (!refreshToken) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token not found',
      });
    }

    let payload: { deviceId: string; userId: string };
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

    if (session.expiresAt < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Session expired',
      });
    }

    if (session.isRevoked) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Token revoked',
      });
    }

    const decoded = this.refreshJwt.decode<{ iat: number }>(refreshToken);

    if (!decoded?.iat) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid refresh token payload',
      });
    }

    const tokenIatDate = new Date(decoded.iat * 1000);

    if (session.lastActiveDate.toISOString() !== tokenIatDate.toISOString()) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Refresh token already used',
      });
    }

    const user = await this.usersQueryRepository.findById(session.userId);

    const newRefreshToken = this.refreshJwt.sign({
      userId: user!.id,
      deviceId: session.deviceId,
    });

    const newHash = await bcrypt.hash(newRefreshToken, 10);

    const decodedNew: { iat: number; exp: number } = this.refreshJwt.decode(newRefreshToken);

    const lastActiveDate = new Date(decodedNew.iat * 1000);
    const expiresAt = new Date(decodedNew.exp * 1000);

    const accessToken = this.accessJwt.sign({ id: user!.id });

    await this.sessionRepository.useRefreshToken(
      session.deviceId,
      refreshToken,
      newHash,
      lastActiveDate,
      expiresAt,
    );

    return { accessToken, newRefreshToken };
  }
}
