import { queryClient } from './query-client';
import { listDashboards, readDashboard } from '~/services';

import type { Dashboard } from '~/services';

export const DASHBOARDS_QUERY_KEY = ['dashboards'];

export const DASHBOARD_SUMMARIES_QUERY_KEY = [
  ...DASHBOARDS_QUERY_KEY,
  'summaries',
];

export const DASHBOARD_DETAILS_QUERY_KEY = [...DASHBOARDS_QUERY_KEY, 'details'];

export const DASHBOARDS_QUERY = {
  queryKey: DASHBOARD_SUMMARIES_QUERY_KEY,
  queryFn: listDashboards,
};

export function createDashboardQuery(id: Dashboard['id']) {
  return {
    queryKey: [...DASHBOARD_DETAILS_QUERY_KEY, { id }],
    queryFn: () => readDashboard(id),
  };
}

export async function invalidateDashboards() {
  await queryClient.invalidateQueries({
    queryKey: DASHBOARD_SUMMARIES_QUERY_KEY,
  });
}

export async function invalidateDashboard(id: Dashboard['id']) {
  await queryClient.invalidateQueries({
    queryKey: [...DASHBOARD_DETAILS_QUERY_KEY, { id }],
  });
}

export async function cancelDashboardsQueries() {
  await queryClient.cancelQueries({ queryKey: DASHBOARD_SUMMARIES_QUERY_KEY });
}

export async function cancelDashboardQueries(id: Dashboard['id']) {
  await queryClient.cancelQueries({
    queryKey: [...DASHBOARD_DETAILS_QUERY_KEY, { id }],
  });
}

export async function prefetchDashboards() {
  await queryClient.prefetchQuery(DASHBOARDS_QUERY);
}
