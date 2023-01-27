import { PickType } from "@nestjs/swagger";

import { Dashboard } from "../entities/dashboard.entity";

/** POST /dashboards HTTP/1.1 request body */
export class CreateDashboardDto extends PickType(Dashboard, [
  "name",
] as const) {}
