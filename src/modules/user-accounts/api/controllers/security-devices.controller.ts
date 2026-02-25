import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { AuthenticatedRequest } from '../../types/authenticated-request.interface';
import { GetDevicesQuery } from '../../application/queries/users/get-devices.query-handler';
import { DeleteAllDevicesCommand } from '../../application/use-cases/auth/delete-all-devices.useacse';
import { DeleteDeviceCommand } from '../../application/use-cases/auth/delete-device.command';
// import { SkipThrottle } from '@nestjs/throttler';

@Controller('security/devices')
// TODO Throttle
// @SkipThrottle()
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getDevices(@Req() req: AuthenticatedRequest): Promise<any> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return this.queryBus.execute(new GetDevicesQuery(refreshToken));
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllExceptCurrent(@Req() req: AuthenticatedRequest): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    return this.commandBus.execute(new DeleteAllDevicesCommand(refreshToken));
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return this.commandBus.execute(new DeleteDeviceCommand(refreshToken, deviceId));
  }
}
