import { Outlet } from 'react-router-dom';

import { DASHBOARDS_INDEX_ROUTE } from '.';
import { DASHBOARD_ROUTE } from './dashboard';
import { NEW_DASHBOARD_ROUTE } from './new';

export const DASHBOARDS_ROUTE = {
  path: 'dashboards',
  element: <DashboardsPage />,
  children: [DASHBOARDS_INDEX_ROUTE, NEW_DASHBOARD_ROUTE, DASHBOARD_ROUTE],
};

export function DashboardsPage() {
  return <Outlet />;
}
