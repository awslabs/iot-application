import { Dashboard, listDashboards, readDashboard } from '~/services';

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
