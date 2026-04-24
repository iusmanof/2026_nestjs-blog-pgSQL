import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from '@core/core.config';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  appSetup(app);

  const coreConfig = app.get<CoreConfig>(CoreConfig);
  const port = coreConfig.getPort();
  const env = coreConfig.getEnv();

  await app.listen(port);
  console.log(`🚀 App running on PORT ${port}`);
  console.log(`📦 NODE_ENV: ${env}`);
  console.log('🔥 Server started...');
}

void bootstrap();
