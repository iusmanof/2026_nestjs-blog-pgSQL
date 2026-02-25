// TODO DELETE LATER

// import { Reflector } from '@nestjs/core';
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Request } from 'express';

// import { DomainException } from '../../../../core/exceptions/filters/domain-exceptions';
// import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exception-codes';
// import { ConfigService } from '@nestjs/config';
//
// @Injectable()
// export class BasicAuthGuard implements CanActivate {
//   // private readonly validUsername = 'admin';
//   // private readonly validPassword = 'qwerty';
//
//   private validUsername: string;
//   private validPassword: string;
//
//   constructor(
//     private reflector: Reflector,
//     private configService: ConfigService,
//   ) {
//     this.validUsername = this.configService.get<string>('BASIC_AUTH_USER')!;
//     this.validPassword = this.configService.get<string>('BASIC_AUTH_PASSWORD')!;
//   }
//
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const authHeader = request.headers.authorization;
//
//     const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) {
//       return true;
//     }
//
//     if (!authHeader || !authHeader.startsWith('Basic ')) {
//       throw new DomainException({
//         code: DomainExceptionCode.Unauthorized,
//         message: 'Authorization header missing or invalid',
//       });
//     }
//
//     const base64Credentials = authHeader.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
//     const [username, password] = credentials.split(':');
//
//     if (username !== this.validUsername || password !== this.validPassword) {
//       throw new DomainException({
//         code: DomainExceptionCode.Unauthorized,
//         message: 'Invalid credentials',
//       });
//     }
//
//     return true;
//   }
// }
