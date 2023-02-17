import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from '../dashboards.service';
import { CreateDashboardDto } from 'types';

/**
 * Create dashboard HTTP controller
 *
 * @example
 * Request:
 * ```
 * POST /dashboards HTTP/1.1
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
 * HTTP/1.1 201 Created
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
export class CreateDashboardController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  public create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardsService.create(createDashboardDto);
  }
}
