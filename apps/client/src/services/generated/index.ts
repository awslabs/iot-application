/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { CreateDashboardDto } from './models/CreateDashboardDto';
export type { Dashboard } from './models/Dashboard';
export type { DashboardDefinition } from './models/DashboardDefinition';
export type { DashboardSummary } from './models/DashboardSummary';
export type { DashboardWidget } from './models/DashboardWidget';
export type { UpdateDashboardDto } from './models/UpdateDashboardDto';

export { $CreateDashboardDto } from './schemas/$CreateDashboardDto';
export { $Dashboard } from './schemas/$Dashboard';
export { $DashboardDefinition } from './schemas/$DashboardDefinition';
export { $DashboardSummary } from './schemas/$DashboardSummary';
export { $DashboardWidget } from './schemas/$DashboardWidget';
export { $UpdateDashboardDto } from './schemas/$UpdateDashboardDto';

export { DashboardsService } from './services/DashboardsService';
