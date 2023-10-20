import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MigrationService } from './migration.service';

@ApiTags('migration')
@Controller('api/migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post()
  public migration() {
    // Purposely don't use await so this request can process after the response
    return this.migrationService.migrate();
  }
}
