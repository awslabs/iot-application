import { Module, ModuleMetadata } from '@nestjs/common';

import { MigrationController } from './migration.controller';
import { DashboardsRepository } from '../dashboards/dashboards.repository';
import { MigrationService } from './migration.service';

export const migrationModuleMetadata: ModuleMetadata = {
  controllers: [MigrationController],
  providers: [DashboardsRepository, MigrationService],
};

/** Core Dashboards Module */
@Module(migrationModuleMetadata)
export class MigrationModule {}
