import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { edgeConfig } from './config/edge.config';
import { globalConfig } from './config/global.config';
import { jwtConfig } from './config/jwt.config';
import { DashboardsModule } from './dashboards/dashboards.module';
import { HealthModule } from './health/health.module';
import { DynamoDbLocalSetupService } from './lifecycle-hooks/dynamodb-local-setup';
import { CognitoJwtAuthGuard } from './auth/cognito-jwt-auth.guard';
import { MvcModule } from './mvc/mvc.module';
import { MigrationModule } from './migration/migration.module';
import { EdgeLoginModule } from './edge-login/edge-login.module';
import { LoggerModule } from './logging/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig, databaseConfig, edgeConfig, globalConfig, jwtConfig],
      isGlobal: true,
    }),
    DashboardsModule,
    MigrationModule,
    EdgeLoginModule,
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
