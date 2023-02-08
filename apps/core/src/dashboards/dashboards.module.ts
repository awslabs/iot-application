import { Module } from '@nestjs/common';

import { CreateDashboardController } from './controllers/create.controller';
import { DeleteDashboardController } from './controllers/delete.controller';
import { ListDashboardsController } from './controllers/list.controller';
import { ReadDashboardController } from './controllers/read.controller';
import { UpdateDashboardController } from './controllers/update.controller';
import { DashboardsService } from './dashboards.service';

/** Dashboards Core Module */
@Module({
  controllers: [
    CreateDashboardController,
    DeleteDashboardController,
    ListDashboardsController,
    ReadDashboardController,
    UpdateDashboardController,
  ],
  providers: [DashboardsService],
})
export class DashboardsModule {}
