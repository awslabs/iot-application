import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MigrationService } from './migration.service';

@ApiTags('migration')
@Controller('api/migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post()
  public migration() {
    void this.migrationService.migrate();
  }

  @Get()
  public getMigrationStatus(): MigrationStatus {
    return this.migrationService.getMigrationStatus();
  }
}
