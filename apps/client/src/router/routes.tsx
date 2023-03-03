import type { RouteObject } from 'react-router-dom';

import { DashboardListPage } from '../dashboard-list/dashboard-list.page';
import { DashboardPage } from '../dashboard/dashboard.page';
import { LoginPage } from '../login/login.page';

import { DASHBOARD_LIST_PAGE_TYPE } from '../dashboard-list/dashboard-list.page-type';
import { DASHBOARD_PAGE_TYPE } from '../dashboard/dashboard.page-type';
import type { PageType } from 'src/page/page-type.type';
import type { RouteMatch } from './route-match.type';

const createRouteMatchHandle = (pageType: PageType): RouteMatch['handle'] => {
  return { pageType };
};

export const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
    children: [
      {
        path: '/dashboards',
        element: <DashboardListPage />,
        handle: createRouteMatchHandle(DASHBOARD_LIST_PAGE_TYPE),
      },
      {
        path: '/dashboards/:id',
        element: <DashboardPage />,
        handle: createRouteMatchHandle(DASHBOARD_PAGE_TYPE),
      },
    ],
  },
];
