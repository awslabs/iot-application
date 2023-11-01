import { Module, ModuleMetadata } from '@nestjs/common';

import { DashboardsController } from './dashboards.controller';
import { DashboardsRepository } from './dashboards.repository';
import { DashboardsService } from './dashboards.service';

export const dashboardsModuleMetadata: ModuleMetadata = {
  controllers: [DashboardsController],
  providers: [DashboardsRepository, DashboardsService],
  exports: [DashboardsService],
};

/** Core Dashboards Module */
@Module(dashboardsModuleMetadata)
export class DashboardsModule {}
