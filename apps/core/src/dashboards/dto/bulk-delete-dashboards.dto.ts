import { Dashboard } from '../entities/dashboard.entity';

export class BulkDeleteDashboardDto {
  ids: Dashboard['id'][];
}
