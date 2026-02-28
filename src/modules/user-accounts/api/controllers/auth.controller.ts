import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Response as ExpressResponse } from 'express';

import { LocalAuthGuard } from '../../guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../../decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../../dto/user-context.dto';
import type { AuthenticatedRequest } from '../../types/authenticated-request.interface';
import { LoginResult } from '../../types/login.result';
import { LoginCommand } from '../../application/use-cases/auth/login.usecase';
import { COOKIE_OPTIONS } from '../../cookie/auth-cookie.config';
import { LoginMeta, LoginMetaDecorator } from '../../decorators/login-meta.decarator';
import { RegistrationUserInputDto } from '../dto/registation-user.dto';
import { RegisterUserCommand } from '../../application/use-cases/auth/register-user.usecase';
import { RefreshSession } from '../../types/refresh-session.type';
import { RefreshSessionCommand } from '../../application/use-cases/auth/refresh-session.usecase';
import { LogoutCommand } from '../../application/use-cases/auth/logout.usecase';
import { JwtAuthGuard } from '../../guards/bearer/jwt-auth.guard';
import { MeViewDto } from '../dto/me-view.dto';
import { GetUserByIdQuery } from '../../application/queries/users/get-user-by-id.query-handler';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/auth/password-recovery.usecase';
import { NewPasswordDto } from '../dto/new-password.dto';
import { NewPasswordCommand } from '../../application/use-cases/auth/new-password.usecase';
import { RegistrationConfirmationCommand } from '../../application/use-cases/auth/registration-confirmation.usecase';
import { RegistrationEmailResendingCommand } from '../../application/use-cases/auth/registration-email-resending.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @LoginMetaDecorator() meta: LoginMeta,
    @Res({ passthrough: true })
    res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const result: LoginResult = await this.commandBus.execute(new LoginCommand(user.id, meta));

    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    return { accessToken: result.accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Throttle({ default: { limit: 5, ttl: 10010 } })
  async registration(@Body() body: RegistrationUserInputDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshSession(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result: RefreshSession = await this.commandBus.execute(
      new RefreshSessionCommand(refreshToken),
    );

    res.cookie('refreshToken', result.newRefreshToken, COOKIE_OPTIONS);

    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutSession(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    await this.commandBus.execute(new LogoutCommand(refreshToken));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return await this.queryBus.execute(new GetUserByIdQuery(user));
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryDto): Promise<void> {
    return await this.commandBus.execute(new PasswordRecoveryCommand(dto));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setNewPassword(@Body() dto: NewPasswordDto): Promise<void> {
    return await this.commandBus.execute(new NewPasswordCommand(dto));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body('code') code: string): Promise<void> {
    return await this.commandBus.execute(new RegistrationConfirmationCommand(code));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendRegistrationEmail(@Body('email') email: string): Promise<void> {
    return await this.commandBus.execute(new RegistrationEmailResendingCommand(email));
  }
}
