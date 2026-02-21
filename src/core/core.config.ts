import { Injectable } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.getOrThrow('PORT'));
    this.node_env = this.configService.getOrThrow<Environments>('NODE_ENV');
    this.url = this.configService.getOrThrow('URL');
    this.includeTestingModule = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('INCLUDE_TESTING_MODULE'),
    ) as boolean;

    this.sendInternalServerErrorDetails = configValidationUtility.convertToBoolean(
      this.configService.getOrThrow('SEND_INTERNAL_SERVER_ERROR_DETAILS'),
    ) as boolean;

    configValidationUtility.validateConfig(this);
  }

  getPort() {
    return this.port;
  }
  getEnv() {
    return this.node_env;
  }

  @IsNumber({}, { message: '💎[ENV] set PORT' })
  port: number;

  @IsEnum(Environments, {
    message:
      '💎[ENV] set NODE_ENV' + configValidationUtility.getEnumValues(Environments).join(', '),
  })
  node_env: Environments;

  @IsNotEmpty({ message: '💎[ENV] set URL' })
  url: string;

  @IsBoolean({ message: '💎[ENV] set INCLUDE_TESTING_MODULE, example: true (true/false/0/1)' })
  includeTestingModule!: boolean;

  @IsBoolean({
    message: '💎[ENV] set SEND_INTERNAL_SERVER_ERROR_DETAILS, example: true (true/false/0/1)',
  })
  sendInternalServerErrorDetails!: boolean;
}
