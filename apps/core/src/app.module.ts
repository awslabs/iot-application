import { Module } from '@nestjs/common';
import { DashboardsModule } from './dashboards/dashboards.module';

@Module({
  imports: [DashboardsModule],
})
export class AppModule {
  /** noop */
}
