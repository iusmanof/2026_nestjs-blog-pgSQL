import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class LoginMeta {
  constructor(
    public readonly ip: string,
    public readonly userAgent: string,
  ) {}
}

export const LoginMetaDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LoginMeta => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const ip =
      request.headers['x-forwarded-for']?.toString().split(',')[0] ||
      request.socket?.remoteAddress ||
      '';

    const userAgent = request.headers['user-agent']?.toString() || 'unknown';

    return new LoginMeta(ip, userAgent);
  },
);
