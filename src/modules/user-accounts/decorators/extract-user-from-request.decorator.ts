import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/filters/domain-exception-codes';
import { UserContextDto } from '../dto/user-context.dto';

export const ExtractUserFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserContextDto => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserContextDto }>();

    if (!request.user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'User is not unauthorized',
      });
    }

    return request.user;
  },
);
