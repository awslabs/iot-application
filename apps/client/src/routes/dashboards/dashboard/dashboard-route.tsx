import { DashboardPage } from './dashboard-page';
import { DashboardErrorBoundary } from './components/dashboard-error-boundary';
import { DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARD_PATH } from '~/constants';

import type { RouteObject } from 'react-router-dom';

export const dashboardRoute = {
  path: DASHBOARD_PATH,
  element: (
    <DashboardErrorBoundary>
      <DashboardPage />
    </DashboardErrorBoundary>
  ),
  handle: {
    crumb: () => ({
      // TODO: replace with real dashboard name
      text: 'Dashboard',
      href: '',
    }),
    fullWidth: true,
    format: DASHBOARD_PAGE_FORMAT,
  },
} satisfies RouteObject;
