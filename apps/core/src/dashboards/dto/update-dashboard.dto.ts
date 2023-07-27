import { OmitType, PartialType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** PATCH /api/dashboards/{dashboardId} HTTP/1.1 request body */
export class UpdateDashboardDto extends OmitType(PartialType(Dashboard), [
  'id',
  'creationDate',
  'lastUpdateDate',
] as const) {}
