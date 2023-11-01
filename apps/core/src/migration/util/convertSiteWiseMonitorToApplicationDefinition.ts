import { DashboardDefinition } from 'src/dashboards/entities/dashboard-definition.entity';

export const convertSiteWiseMonitorToApplicationDefinition = (
  sitewiseMonitorDashboardDefinition?: string,
): DashboardDefinition => {
  // TODO: add actual definition conversion
  if (sitewiseMonitorDashboardDefinition) {
    return { widgets: [] };
  }
  return { widgets: [] };
};
