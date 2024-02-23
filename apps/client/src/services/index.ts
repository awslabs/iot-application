export * from './generated';
export { intl } from './intl';

import { v4 as uuid } from 'uuid';
import {
  OpenAPI,
  DashboardsService,
  MigrationService,
  EdgeLoginService,
} from './generated';

import { authService } from '~/auth/auth-service';

OpenAPI.TOKEN = () => authService.getToken();

function getHeaders() {
  return Promise.resolve({
    'X-Request-ID': uuid(),
  });
}

OpenAPI.HEADERS = getHeaders;

export function setServiceUrl(url: string) {
  OpenAPI.BASE = url;
}

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

export const listDashboards: ListDashboards = () =>
  DashboardsService.dashboardsControllerList();
export const createDashboard: CreateDashboard = (dto) =>
  DashboardsService.dashboardsControllerCreate(dto);
export const readDashboard: ReadDashboard = (id) =>
  DashboardsService.dashboardsControllerRead(id);
export const updateDashboard: UpdateDashboard = (id, dto) =>
  DashboardsService.dashboardsControllerUpdate(id, dto);
export const deleteDashboard: DeleteDashboard = (id) =>
  DashboardsService.dashboardsControllerDelete(id);
export const bulkDeleteDashboards: BulkDeleteDashboards = (ids) =>
  DashboardsService.dashboardsControllerBulkDelete(ids);

// Migration API
export type DashboardMigration =
  typeof MigrationService.migrationControllerMigration;
export type DashboardMigrationStatus =
  typeof MigrationService.migrationControllerGetMigrationStatus;

export const dashboardMigration: DashboardMigration = () =>
  MigrationService.migrationControllerMigration();
export const dashboardMigrationStatus: DashboardMigrationStatus = () =>
  MigrationService.migrationControllerGetMigrationStatus();

// EdgeLogin API
export type EdgeLogin = typeof EdgeLoginService.edgeLogin;

export const edgeLogin: EdgeLogin = (body) => EdgeLoginService.edgeLogin(body);
