import { Module, ModuleMetadata } from '@nestjs/common';

import { MigrationController } from './migration.controller';
import { DashboardsRepository } from '../dashboards/dashboards.repository';
import { MigrationService } from './migration.service';
import { DashboardsModule } from '../dashboards/dashboards.module';

export const migrationModuleMetadata: ModuleMetadata = {
  imports: [DashboardsModule],
  controllers: [MigrationController],
  providers: [DashboardsRepository, MigrationService],
};

/** Core Dashboards Module */
@Module(migrationModuleMetadata)
export class MigrationModule {}
