import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { databaseConfig } from './config/database.config';
import { DashboardsModule } from './dashboards/dashboards.module';
import { HealthModule } from './health/health.module';
import { DynamoDbLocalSetupService } from './lifecycle-hooks/dynamodb-local-setup';
import { CognitoJwtAuthGuard } from './auth/cognito-jwt-auth.guard';
import { authConfig } from './config/auth.config';
import { MvcModule } from './mvc/mvc.module';
import { jwtConfig } from './config/jwt.config';
import { MigrationModule } from './migration/migration.module';
import { LoggerModule } from './logging/logger.module';
import { globalConfig } from './config/global.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig, databaseConfig, globalConfig, jwtConfig],
      isGlobal: true,
    }),
    DashboardsModule,
    MigrationModule,
    MvcModule,
    HealthModule,
    LoggerModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 10, limit: 100 }),
  ],
  providers: [
    DynamoDbLocalSetupService,
    {
      provide: APP_GUARD,
      useClass: CognitoJwtAuthGuard,
    },
  ],
})
export class AppModule {
  /** noop */
}
