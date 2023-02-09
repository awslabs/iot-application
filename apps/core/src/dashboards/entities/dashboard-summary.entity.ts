import { OmitType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** POST /dashboards HTTP/1.1 request body */
export class DashboardSummary extends OmitType(Dashboard, [
  'definition',
] as const) {}
