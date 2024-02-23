import {
  DashboardsService,
  EdgeLoginService,
  MigrationService,
} from './generated';

// Dashboard API
export type ListDashboards = typeof DashboardsService.dashboardsControllerList;
export type CreateDashboard =
  typeof DashboardsService.dashboardsControllerCreate;
export type ReadDashboard = typeof DashboardsService.dashboardsControllerRead;
export type UpdateDashboard =
  typeof DashboardsService.dashboardsControllerUpdate;
export type DeleteDashboard =
  typeof DashboardsService.dashboardsControllerDelete;
export type BulkDeleteDashboards =
  typeof DashboardsService.dashboardsControllerBulkDelete;

// Migration API
export type DashboardMigration =
  typeof MigrationService.migrationControllerMigration;
export type DashboardMigrationStatus =
  typeof MigrationService.migrationControllerGetMigrationStatus;

// EdgeLogin API
export type EdgeLogin = typeof EdgeLoginService.edgeLogin;
