import { validateOrReject } from 'class-validator';
import { Dashboard } from 'types';

export class DashboardsValidator {
  async validate(dashboard: Dashboard | Object): Promise<void | never> {
    await validateOrReject(dashboard);
  }

  async validateList(dashboards: Dashboard[] | Object[]) {
    await Promise.all(dashboards.map(this.validate));
  }
}
