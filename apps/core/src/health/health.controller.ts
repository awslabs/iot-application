import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";

/** HTTP API for application health status */
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get() // GET /health
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.http.pingCheck("core", "http://localhost:3000/"),
    ]);
  }
}
