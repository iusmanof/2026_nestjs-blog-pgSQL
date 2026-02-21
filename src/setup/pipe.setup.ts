import { INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { DomainException, Extension } from '../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/filters/domain-exception-codes';

export const errorFormatter = (errors: ValidationError[], acc: Extension[] = []): Extension[] => {
  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorFormatter(error.children, acc);
      continue;
    }

    if (error.constraints) {
      if (acc.some((e) => e.field === error.property)) continue;

      const firstKey = Object.keys(error.constraints)[0];

      acc.push({
        message: error.constraints[firstKey],
        field: error.property,
      });
    }
  }

  return acc;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);
        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: formattedErrors,
        });
      },
    }),
  );
}
