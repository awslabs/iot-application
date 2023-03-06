import * as generated from './generated';
export * from './generated';

export const {
  dashboardsControllerList: listDashboards,
  dashboardsControllerCreate: createDashboard,
  dashboardsControllerRead: readDashboard,
  dashboardsControllerUpdate: updateDashboard,
  dashboardsControllerDelete: deleteDashboard,
} = generated.DashboardsService;
