import { Module, ModuleMetadata } from '@nestjs/common';

import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';

export const migrationModuleMetadata: ModuleMetadata = {
  controllers: [MigrationController],
  providers: [MigrationService],
};

/** Core Dashboards Module */
@Module(migrationModuleMetadata)
export class MigrationModule {}
