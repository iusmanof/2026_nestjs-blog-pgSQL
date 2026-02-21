import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipe.setup';
import { corsSetup } from './cors.setup';
import { httpExceptionFilterSetup } from './http-filter.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  httpExceptionFilterSetup(app);
  globalPrefixSetup(app);
  corsSetup(app);
}
