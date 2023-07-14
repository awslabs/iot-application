import { PickType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** PUT /api/dashboards/{dashboardId} HTTP/1.1 request params */
export class UpdateDashboardParams extends PickType(Dashboard, [
  'id',
] as const) {}
