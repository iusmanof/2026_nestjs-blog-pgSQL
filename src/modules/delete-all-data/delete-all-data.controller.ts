import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DeleteAllDataService } from './delete-all-data.service';

@Controller('testing')
export class DeleteAllDataController {
  constructor(private readonly testingService: DeleteAllDataService) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearDatabase(): Promise<void> {
    await this.testingService.clearAll();
  }
}
