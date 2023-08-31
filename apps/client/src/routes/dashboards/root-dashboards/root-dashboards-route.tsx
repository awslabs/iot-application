import { RootDashboardsPage } from './root-dashboards-page';
import { dashboardsIndexRoute } from '../dashboards-index';
import { dashboardRoute } from '../dashboard';
import { createDashboardRoute } from '../create';
import { DASHBOARDS_PATH, DASHBOARDS_HREF } from '~/constants';

import type { RouteObject } from 'react-router-dom';

export const rootDashboardsRoute = {
  path: DASHBOARDS_PATH,
  element: <RootDashboardsPage />,
  handle: {
    activeHref: DASHBOARDS_HREF,
  },
  children: [dashboardsIndexRoute, dashboardRoute, createDashboardRoute],
} satisfies RouteObject;
