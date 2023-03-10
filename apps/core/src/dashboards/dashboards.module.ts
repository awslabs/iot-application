import { Module, ModuleMetadata } from '@nestjs/common';

import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

export const dashboardsModuleMetadata: ModuleMetadata = {
  controllers: [DashboardsController],
  providers: [DashboardsService],
};

/** Core Dashboards Module */
@Module(dashboardsModuleMetadata)
export class DashboardsModule {}
