import { PickType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** DELETE /api/dashboards/{dashboardId} HTTP/1.1 request params */
export class DeleteDashboardParams extends PickType(Dashboard, [
  'id',
] as const) {}
