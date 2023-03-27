import { OmitType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** PUT /dashboards/{dashboardId} HTTP/1.1 request body */
export class UpdateDashboardDto extends OmitType(Dashboard, [
  'id',
  'creationDate',
  'lastUpdateDate',
] as const) {}
