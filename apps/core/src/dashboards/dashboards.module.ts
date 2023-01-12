import { Module } from "@nestjs/common";
import { DashboardsService } from "./dashboards.service";
import { DashboardsController } from "./dashboards.controller";

@Module({
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule {}
