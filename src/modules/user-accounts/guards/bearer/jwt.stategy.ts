import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { UserContextDto } from '../../dto/user-context.dto';
import { DomainException } from '../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exception-codes';
import { UsersEntity } from '../../domain/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')!,
    });
  }

  async validate(payload: UserContextDto): Promise<UserContextDto> {
    const user: UsersEntity | null = await this.usersQueryRepository.findById(payload.id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'User not found',
        extensions: [{ field: 'id', message: 'User not found' }],
      });
    }

    return {
      id: user.id.toString(),
      login: user.login,
    };
  }
}
