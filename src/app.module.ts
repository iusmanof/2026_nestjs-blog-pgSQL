import { Module } from '@nestjs/common';
import { configModule } from './config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { PostgresqlDatabaseModule } from './core/database/postgresql-database.module';
import { DeleteAllDataModule } from './modules/delete-all-data/delete-all-data.module';
import { GlobalThrottlerModule } from './core/throttler/throttler.module';

@Module({
  imports: [
    configModule,
    PostgresqlDatabaseModule,
    CoreModule,
    UserAccountsModule,
    BloggersPlatformModule,
    DeleteAllDataModule,
    GlobalThrottlerModule,
  ],
  controllers: [],
  providers: [CoreConfig],
  exports: [CoreConfig],
})
export class AppModule {}
