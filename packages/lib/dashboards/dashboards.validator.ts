import { Dashboard } from 'core/src/types';
import { validateOrReject } from 'class-validator';

export class DashboardsValidator {
  async validate(dashboard: Dashboard | Object): Promise<void | never> {
    await validateOrReject(dashboard);
  }

  async validateList(dashboards: Dashboard[] | Object[]) {
    await Promise.all(dashboards.map(this.validate));
  }
}
