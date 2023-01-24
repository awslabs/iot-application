import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { DashboardsModule } from './dashboards/dashboards.module';
import { HealthModule } from './health/health.module';
import { DynamoDbLocalSetupService } from './lifecycle-hooks/dynamodb-local-setup';
import { APP_GUARD } from '@nestjs/core';
import { CognitoJwtAuthGuard } from './auth/cognito-jwt-auth.guard';
import { authConfig } from './config/auth.config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig], isGlobal: true }),
    ConfigModule.forRoot({ load: [authConfig], isGlobal: true }),
    DashboardsModule,
    HealthModule,
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
