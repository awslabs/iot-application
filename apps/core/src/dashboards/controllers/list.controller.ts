import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { DashboardsService } from "../dashboards.service";

/**
 * List dashboards HTTP controller
 *
 * @example
 * Request:
 * ```
 * GET /dashboards HTTP/1.1
 * ```
 *
 * @example
 * Response:
 * ```
 * HTTP/1.1 200 OK
 *
 * [{
 *   "id": {dashboardId},
 *   "name": "Wind Farm 1",
 *   "definition": {
 *     "widgets": []
 *   }
 * },
 * {
 *   "id": {dashboardId},
 *   "name": "Wind Farm 2",
 *   "definition": {
 *     "widgets": []
 *   }
 * }]
 * ```
 */
@ApiTags("dashboards")
@Controller("dashboards")
export class ListDashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  public list() {
    return this.dashboardsService.list();
  }
}
