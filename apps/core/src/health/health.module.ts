import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { DynamoDbHealthIndicator } from './indicators/dynamodb.health';

/** Application health status */
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [DynamoDbHealthIndicator],
})
export class HealthModule {}
