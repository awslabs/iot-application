import { DASHBOARDS_INDEX_PAGE_FORMAT } from '~/constants/format';
import { DashboardsIndexPage } from './dashboards-index-page';

import type { RouteObject } from 'react-router-dom';

export const dashboardsIndexRoute = {
  index: true,
  element: <DashboardsIndexPage />,
  handle: {
    format: DASHBOARDS_INDEX_PAGE_FORMAT,
  },
} satisfies RouteObject;
