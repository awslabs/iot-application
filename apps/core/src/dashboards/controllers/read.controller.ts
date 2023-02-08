import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from '../dashboards.service';
import { ReadDashboardParams } from '../params/read-dashboard.params';

/**
 * Read dashboard HTTP controller
 *
 * @example
 * Request:
 * ```
 * GET /dashboards/{dashboardId} HTTP/1.1
 * ```
 *
 * @example
 * Response:
 * ```
 * HTTP/1.1 200 OK
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
@ApiTags('dashboards')
@Controller('dashboards')
export class ReadDashboardController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get(':id')
  public read(@Param() params: ReadDashboardParams) {
    const dashboard = this.dashboardsService.read(params.id);

    if (dashboard === undefined) {
      throw new NotFoundException();
    }

    return dashboard;
  }
}
