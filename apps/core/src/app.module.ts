import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { DashboardsModule } from './dashboards/dashboards.module';
import { DynamoDbLocalSetupService } from './lifecycle-hooks/dynamodb-local-setup';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig], isGlobal: true }),
    DashboardsModule,
  ],
  // TODO: use dynamic module to load DynamoDbLocalSetupService for development environment only
  providers: [DynamoDbLocalSetupService],
})
export class AppModule {
  /** noop */
}
