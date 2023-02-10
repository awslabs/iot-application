import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from '../dashboards.service';
import { UpdateDashboardDto } from '../dto/update-dashboard.dto';
import { UpdateDashboardParams } from '../params/update-dashboard.params';

/**
 * Update dashboard HTTP controller
 *
 * @example
 * Request:
 * ```
 * PUT /dashboards/{dashboardId} HTTP/1.1
 *
 * {
 *   "name": "Wind Farm 4",
 *   "description": "Wind Farm 4 Description",
 *   "definition": {
 *     "widgets": []
 *   }
 * }
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
export class UpdateDashboardController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Put(':id')
  public async update(
    @Param() params: UpdateDashboardParams,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    const dashboard = await this.dashboardsService.update({
      ...updateDashboardDto,
      ...params,
    });

    if (dashboard === undefined) {
      throw new NotFoundException();
    }

    return dashboard;
  }
}
