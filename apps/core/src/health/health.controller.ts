import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/public.decorator';

/** HTTP API for application health status */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Public()
  @Get() // GET /health
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.http.pingCheck('core', 'http://localhost:3000/'),
    ]);
  }
}
