import { Module } from '@nestjs/common';
import UserController from './api/controllers/users.controller';
import { CryptoService } from './application/crypto.service';
import { GetUsersQueryHandler } from './application/queries/users/get-users.query-handler';
import { CreateUserUseCase } from './application/use-cases/users/create-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/users/delete-user.usecase';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import UsersRepository from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './domain/users.entity';
import { AuthController } from './api/controllers/auth.controller';
import { NotificationModule } from '../notification/notification.module';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { SessionEntity } from './domain/session.entity';
import { LocalStrategy } from './guards/local/local.strategy';
import { ValidateUserService } from './application/validate-user.service';
import { LoginUseCase } from './application/use-cases/auth/login.usecase';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { SessionRepository } from './infrastructure/session.repository';
import { UserAccountsConfig } from './config/user-accounts.config';
import { JwtService } from '@nestjs/jwt';
import { UserEmailConfirmationEntity } from './domain/user-email-confirmation.entity';
import { RegisterUserUseCase } from './application/use-cases/auth/register-user.usecase';
import { CodeGeneratorService } from './application/code-generator.service';
import { EmailConfirmationRepository } from './infrastructure/email-confirmation.repository';
import { RefreshSessionUseCase } from './application/use-cases/auth/refresh-session.usecase';
import { LogoutUseCase } from './application/use-cases/auth/logout.usecase';
import { JwtStrategy } from './guards/bearer/jwt.stategy';
import { GetUserByIdQueryHandler } from './application/queries/users/get-user-by-id.query-handler';
import { PasswordRecoveryUseCase } from './application/use-cases/auth/password-recovery.usecase';
import { NewPasswordUseCase } from './application/use-cases/auth/new-password.usecase';
import { RegistrationConfirmationUseCase } from './application/use-cases/auth/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/use-cases/auth/registration-email-resending.usecase';
import { GetDevicesQueryHandler } from './application/queries/users/get-devices.query-handler';
import { DeleteDeviceUseCase } from './application/use-cases/auth/delete-device.command';

const controllers = [UserController, AuthController];
const services = [CryptoService, ValidateUserService, CodeGeneratorService];
const repositories = [
  UsersQueryRepository,
  UsersRepository,
  SessionRepository,
  EmailConfirmationRepository,
];
const strategies = [BasicStrategy, LocalStrategy, JwtStrategy];
const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  RegisterUserUseCase,
  RefreshSessionUseCase,
  LogoutUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  DeleteDeviceUseCase,
];
const handlers = [GetUsersQueryHandler, GetUserByIdQueryHandler, GetDevicesQueryHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UsersEntity]),
    TypeOrmModule.forFeature([SessionEntity]),
    TypeOrmModule.forFeature([UserEmailConfirmationEntity]),
    PassportModule,
    NotificationModule,
  ],
  controllers: [...controllers],
  providers: [
    UserAccountsConfig,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: {
            expiresIn: userAccountConfig.accessTokenExpireIn,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: {
            expiresIn: userAccountConfig.refreshTokenExpireIn,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    ...services,
    ...repositories,
    ...strategies,
    ...useCases,
    ...handlers,
  ],
  exports: [
    UsersRepository,
    SessionRepository,
    EmailConfirmationRepository,
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
  ],
})
export class UserAccountsModule {}
