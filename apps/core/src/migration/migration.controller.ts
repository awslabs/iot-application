import { Controller, HttpCode, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MigrationService } from './service/migration.service';
import { MigrationStatus } from './entities/migration-status.entity';

@ApiTags('migration')
@Controller('api/migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post()
  @HttpCode(202)
  public migration() {
    void this.migrationService.migrate();
  }

  @Get()
  public getMigrationStatus(): MigrationStatus {
    return this.migrationService.getMigrationStatus();
  }
}
