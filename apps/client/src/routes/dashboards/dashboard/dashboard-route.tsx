import { DashboardPage } from './dashboard-page';
import { DashboardErrorBoundary } from './components/dashboard-error-boundary';
import { DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARD_PATH } from '~/constants';

import { queryClient } from '~/data/query-client';

import { type RouteObject } from 'react-router-dom';
import { createDashboardQuery } from '~/data/dashboards';
import invariant from 'tiny-invariant';
import { Dashboard } from '~/services';
import { Maybe } from '~/types';
import { getCurrentUser } from 'aws-amplify/auth';

export const dashboardRoute = {
  path: DASHBOARD_PATH,
  element: (
    <DashboardErrorBoundary>
      <DashboardPage />
    </DashboardErrorBoundary>
  ),
  loader: async ({ params }) => {
    invariant(params.dashboardId, 'Expected dashboardId is to be defined');
    /**
     * The loader is called before the element is rendered. This means we need
     * to wait for authentication state before we can fetch the dashboard.
     */
    await getCurrentUser();
    return queryClient.fetchQuery(createDashboardQuery(params.dashboardId));
  },
  handle: {
    crumb: (dashboard: Maybe<Dashboard>) => {
      return {
        // if dashboard is not found, we display 404 breadcrumb
        text: dashboard?.name ?? 'Not found',
        href: '',
      };
    },
    // do not render at full width if dashboard is not found
    fullWidth: (dashboard: Maybe<Dashboard>) => Boolean(dashboard),
    format: DASHBOARD_PAGE_FORMAT,
  },
} satisfies RouteObject;
