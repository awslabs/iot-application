import type { RouteObject } from 'react-router-dom';

import { Root } from '../root/root';
import { DashboardListPage } from '../dashboard-list/dashboard-list.page';
import { DashboardPage } from '../dashboard/dashboard.page';
import { LoginPage } from '../login/login.page';

import { DASHBOARD_LIST_PAGE_TYPE } from '../dashboard-list/dashboard-list.page-type';
import { DASHBOARD_PAGE_TYPE } from '../dashboard/dashboard.page-type';
import { LOGIN_PAGE_TYPE } from '../login/login.page-type';
import type { PageType } from 'src/page/page-type.type';
import type { RouteMatch } from './route-match.type';

const createRouteMatchHandle = (pageType: PageType): RouteMatch['handle'] => {
  return { pageType };
};

export const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        handle: createRouteMatchHandle(LOGIN_PAGE_TYPE),
      },
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
