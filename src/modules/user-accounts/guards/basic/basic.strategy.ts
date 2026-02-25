import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as PassportBasicStrategy } from 'passport-http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(PassportBasicStrategy) {
  private validUsername: string;
  private validPassword: string;
  constructor(private configService: ConfigService) {
    super();
    this.validUsername = this.configService.get<string>('BASIC_AUTH_USER')!;
    this.validPassword = this.configService.get<string>('BASIC_AUTH_PASSWORD')!;
  }

  validate(username: string, password: string) {
    if (username === this.validUsername && password === this.validPassword) {
      return { username };
    }
    return null;
  }
}
