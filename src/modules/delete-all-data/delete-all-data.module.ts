import { Module } from '@nestjs/common';
import { DeleteAllDataController } from './delete-all-data.controller';
import { DeleteAllDataService } from './delete-all-data.service';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

@Module({
  imports: [BloggersPlatformModule, UserAccountsModule],
  controllers: [DeleteAllDataController],
  providers: [DeleteAllDataService],
})
export class DeleteAllDataModule {}
