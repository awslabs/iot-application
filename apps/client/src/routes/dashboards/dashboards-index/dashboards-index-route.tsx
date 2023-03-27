import { createBrowserRouter } from 'react-router-dom';

import { DASHBOARDS_INDEX_PAGE_FORMAT } from '~/constants/format';
import { DashboardsIndexPage } from './dashboards-index-page';

export const dashboardsIndexRoute = {
  index: true,
  element: <DashboardsIndexPage />,
  handle: {
    format: DASHBOARDS_INDEX_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];
