import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { UserContextDto } from '../../dto/user-context.dto';
import SessionRepository from '@user-accounts/infrastructure/session.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')!,
    });
  }

  async validate(payload: UserContextDto): Promise<UserContextDto> {
    const device = await this.sessionRepository.findByDeviceId(payload.id);
    return {
      id: device!.userId.toString(),
    };
  }
}
