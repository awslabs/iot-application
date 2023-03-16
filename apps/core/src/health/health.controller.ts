import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../auth/public.decorator';
import { DynamoDbHealthIndicator } from './indicators/dynamodb.health';

/** HTTP API for application health status */
@Controller('health')
export class HealthController {
  constructor(
    private dynamoDbHealthIndicator: DynamoDbHealthIndicator,
    private readonly health: HealthCheckService,
  ) {}

  @Public()
  @Get() // GET /health
  @HealthCheck()
  async check() {
    return this.health.check([() => this.dynamoDbHealthIndicator.check('db')]);
  }
}
