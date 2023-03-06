import { PickType } from '@nestjs/swagger';

import { Dashboard } from '../entities/dashboard.entity';

/** GET /dashboards/{dashboardId} HTTP/1.1 request params */
export class ReadDashboardParams extends PickType(Dashboard, ['id'] as const) {}
