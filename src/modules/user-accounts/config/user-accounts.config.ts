import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  @IsNotEmpty({ message: '💎[ENV] set ACCESS_TOKEN_EXPIRE_IN' })
  accessTokenExpireIn!: number;

  @IsNotEmpty({ message: '💎[ENV] set refreshTokenExpireIn' })
  refreshTokenExpireIn!: number;

  @IsNotEmpty({ message: '💎[ENV] set refreshTokenSecret' })
  refreshTokenSecret!: string;

  @IsNotEmpty({ message: '💎[ENV] set accessTokenSecret' })
  accessTokenSecret!: string;

  constructor(private readonly configService: ConfigService<any, true>) {
    this.accessTokenExpireIn = Number(this.configService.get<string>('ACCESS_TOKEN_EXPIRE_IN'));

    this.refreshTokenExpireIn = Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRE_IN'));

    this.refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');

    this.accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

    configValidationUtility.validateConfig(this);
  }
}
