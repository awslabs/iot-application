import { createBrowserRouter, Outlet } from 'react-router-dom';

import { DASHBOARDS_PATH, DASHBOARDS_HREF } from '~/constants';
import { intl } from '~/services';
import { route as dashboardsIndexRoute } from './index';
import { route as dashboardRoute } from './dashboard';
import { route as createDashboardRoute } from './create';

export const route = {
  path: DASHBOARDS_PATH,
  element: <DashboardsPage />,
  handle: {
    activeHref: DASHBOARDS_HREF,
    crumb: () => ({
      text: intl.formatMessage({
        defaultMessage: 'Dashboards',
        description: 'dashboards route breadcrumb text',
      }),
      href: DASHBOARDS_HREF,
    }),
  },
  children: [dashboardsIndexRoute, dashboardRoute, createDashboardRoute],
} satisfies Parameters<typeof createBrowserRouter>[0][number];

export function DashboardsPage() {
  return <Outlet />;
}
