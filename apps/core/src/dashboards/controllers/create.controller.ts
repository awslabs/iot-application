import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { DashboardsService } from "../dashboards.service";
import { CreateDashboardDto } from "../dto/create-dashboard.dto";

/**
 * Create dashboard HTTP controller
 *
 * @example
 * Request:
 * ```
 * POST /dashboards HTTP/1.1
 *
 * {
 *   "name": "Wind Farm 4"
 * }
 * ```
 *
 * @example
 * Response:
 * ```
 * HTTP/1.1 201 Created
 *
 * {
 *   "id": {dashboardId},
 *   "name": "Wind Farm 4",
 *   "definition": {
 *     "widgets": []
 *   }
 * }
 * ```
 */
@ApiTags("dashboards")
@Controller("dashboards")
export class CreateDashboardController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  public create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardsService.create(createDashboardDto.name);
  }
}
