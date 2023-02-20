import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReadDashboardParams } from 'core-types';

import { DashboardsService } from '../dashboards.service';

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
 *   "description": "Wind Farm 4 Description",
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
  public async read(@Param() params: ReadDashboardParams) {
    const dashboard = await this.dashboardsService.read(params.id);

    if (dashboard === undefined) {
      throw new NotFoundException();
    }

    return dashboard;
  }
}
