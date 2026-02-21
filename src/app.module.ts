import { Module } from '@nestjs/common';
import { configModule } from './config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [configModule, CoreModule, UserAccountsModule, BloggersPlatformModule],
  controllers: [],
  providers: [CoreConfig],
  // exports: [CoreConfig] // it contain throttle
})
export class AppModule {}
