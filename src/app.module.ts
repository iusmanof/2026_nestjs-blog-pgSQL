import { Module } from '@nestjs/common';
import { configModule } from './config-module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { PostgresqlDatabaseModule } from './core/database/postgresql-database.module';
import { DeleteAllDataModule } from './modules/delete-all-data/delete-all-data.module';

@Module({
  imports: [
    configModule,
    PostgresqlDatabaseModule,
    CoreModule,
    UserAccountsModule,
    BloggersPlatformModule,
    DeleteAllDataModule,
  ],
  controllers: [],
  providers: [CoreConfig],
  // exports: [CoreConfig] // it contain throttle
})
export class AppModule {}
