import { Module, ModuleMetadata } from '@nestjs/common';

import { CreateDashboardController } from './controllers/create.controller';
import { DeleteDashboardController } from './controllers/delete.controller';
import { ListDashboardsController } from './controllers/list.controller';
import { ReadDashboardController } from './controllers/read.controller';
import { UpdateDashboardController } from './controllers/update.controller';
import { DashboardsService } from './dashboards.service';

export const dashboardsModuleMetadata: ModuleMetadata = {
  controllers: [
    CreateDashboardController,
    DeleteDashboardController,
    ListDashboardsController,
    ReadDashboardController,
    UpdateDashboardController,
  ],
  providers: [DashboardsService],
};

/** Core Dashboards Module */
@Module(dashboardsModuleMetadata)
export class DashboardsModule {}
