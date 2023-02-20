import type { DashboardsCoreClient } from '../dashboards/dashboards.client';

export interface CoreClients {
  dashboards: DashboardsCoreClient;
}

export const createUseCore = (clients: CoreClients) => () => clients;
