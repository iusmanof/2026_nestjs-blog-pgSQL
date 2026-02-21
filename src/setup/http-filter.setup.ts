import { ArgumentsHost, Catch, ExceptionFilter, INestApplication } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/filters/domain-exception-codes';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;

    switch (exception.code) {
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.BadRequest:
        status = 400;
        break;
      case DomainExceptionCode.NotFound:
        status = 404;
        break;
      case DomainExceptionCode.Forbidden:
        status = 403;
        break;
      case DomainExceptionCode.Unauthorized:
        status = 401;
        break;
      default:
        status = 500;
        break;
    }

    response.status(status).json({
      errorsMessages: exception.extensions || [],
    });
  }
}

export function httpExceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new DomainExceptionFilter());
}
