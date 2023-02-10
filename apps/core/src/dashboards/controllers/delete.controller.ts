import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DashboardsService } from '../dashboards.service';
import { DeleteDashboardParams } from '../params/delete-dashboard.params';

/**
 * Delete dashboard HTTP controller
 *
 * @example
 * Request:
 * ```
 * DELETE /dashboards/{dashboardId} HTTP/1.1
 * ```
 *
 * @example
 * Response:
 * ```
 * HTTP/1.1 204 No Content
 * ```
 */
@ApiTags('dashboards')
@Controller('dashboards')
export class DeleteDashboardController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @HttpCode(204)
  @Delete(':id')
  public async delete(@Param() params: DeleteDashboardParams) {
    const deleted = await this.dashboardsService.delete(params.id);

    if (!deleted) {
      throw new NotFoundException();
    }
  }
}
