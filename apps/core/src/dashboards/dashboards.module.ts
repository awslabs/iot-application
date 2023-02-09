import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';

import { CreateDashboardController } from './controllers/create.controller';
import { DeleteDashboardController } from './controllers/delete.controller';
import { ListDashboardsController } from './controllers/list.controller';
import { ReadDashboardController } from './controllers/read.controller';
import { UpdateDashboardController } from './controllers/update.controller';
import { DashboardsService } from './dashboards.service';

/** Core Dashboards Module */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
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
