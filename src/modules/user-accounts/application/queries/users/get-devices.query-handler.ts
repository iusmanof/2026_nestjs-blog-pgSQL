import { JwtService } from '@nestjs/jwt';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { SessionRepository } from '../../../infrastructure/session.repository';
import { DeviceViewDto } from '../../../api/dto/device-view.dto';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from '../../../config/user-accounts.config';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

export class GetDevicesQuery {
  constructor(public readonly refreshToken: string) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesQueryHandler implements IQueryHandler<GetDevicesQuery> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly config: UserAccountsConfig,
  ) {}

  async execute(query: GetDevicesQuery) {
    let payload: {
      userId: string;
      deviceId: string;
    };

    try {
      payload = this.jwtService.verify(query.refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
    const sessions = await this.sessionRepository.findByUserId(payload.userId);

    if (!sessions) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Session not found',
      });
    }

    return DeviceViewDto.mapToViews(sessions);
  }
}
