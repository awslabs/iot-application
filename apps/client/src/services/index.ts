export * from './generated';
export { intl } from './intl';

import { v4 as uuid } from 'uuid';
import {
  OpenAPI,
  DashboardsService,
  MigrationService,
  EdgeLoginService,
} from './generated';
import {
  listDashboards as listDashboardsLocal,
  createDashboard as createDashboardLocal,
  readDashboard as readDashboardLocal,
  updateDashboard as updateDashboardLocal,
  deleteDashboard as deleteDashboardLocal,
  bulkDeleteDashboards as bulkDeleteDashboardsLocal,
} from './local-storage-dashboard/dashboard-service';

import { authService } from '~/auth/auth-service';
import type {
  ListDashboards,
  CreateDashboard,
  ReadDashboard,
  UpdateDashboard,
  DeleteDashboard,
  BulkDeleteDashboards,
} from './types';
import { DashboardMigration, DashboardMigrationStatus } from './types';
import { EdgeLogin } from './types';

let authMode = 'cognito';

export function setAuthMode(mode: string) {
  authMode = mode;
}

function isEdgeMode() {
  return authMode === 'edge';
}

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
export const listDashboards: ListDashboards = isEdgeMode()
  ? () => listDashboardsLocal()
  : () => DashboardsService.dashboardsControllerList();
export const createDashboard: CreateDashboard = isEdgeMode()
  ? (dto) => createDashboardLocal(dto)
  : (dto) => DashboardsService.dashboardsControllerCreate(dto);
export const readDashboard: ReadDashboard = isEdgeMode()
  ? (id) => readDashboardLocal(id)
  : (id) => DashboardsService.dashboardsControllerRead(id);
export const updateDashboard: UpdateDashboard = isEdgeMode()
  ? (id, dto) => updateDashboardLocal(id, dto)
  : (id, dto) => DashboardsService.dashboardsControllerUpdate(id, dto);
export const deleteDashboard: DeleteDashboard = isEdgeMode()
  ? (id) => deleteDashboardLocal(id)
  : (id) => DashboardsService.dashboardsControllerDelete(id);
export const bulkDeleteDashboards: BulkDeleteDashboards = isEdgeMode()
  ? (dto) => bulkDeleteDashboardsLocal(dto)
  : (dto) => DashboardsService.dashboardsControllerBulkDelete(dto);

// Migration API
export const dashboardMigration: DashboardMigration = () =>
  MigrationService.migrationControllerMigration();
export const dashboardMigrationStatus: DashboardMigrationStatus = () =>
  MigrationService.migrationControllerGetMigrationStatus();

// EdgeLogin API
export const edgeLogin: EdgeLogin = (body) => EdgeLoginService.edgeLogin(body);
