import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DashboardsModule } from "./dashboards/dashboards.module";

@Module({
  imports: [DashboardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
