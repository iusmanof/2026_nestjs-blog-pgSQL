import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../infrastructure/session.repository';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

export class DeleteDeviceCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase implements ICommandHandler<DeleteDeviceCommand> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly config: UserAccountsConfig,
  ) {}

  async execute(command: DeleteDeviceCommand): Promise<void> {
    let payload: { userId: string };

    try {
      payload = this.jwtService.verify(command.refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }

    const session = await this.sessionRepository.findByDeviceId(command.deviceId);

    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Session not found',
        extensions: [{ field: 'session', message: 'Session not found' }],
      });
    }

    if (session.userId !== payload.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Permission to access this session',
        extensions: [{ field: 'session', message: 'Access denied for this session' }],
      });
    }

    await this.sessionRepository.deleteByDeviceId(command.deviceId);
  }
}
