import type { RouteObject } from 'react-router-dom';

import { Root } from '../root/root';
import { DashboardListPage } from '../dashboard-list/dashboard-list.page';
import { DashboardPage } from '../dashboard/dashboard.page';
import { LoginPage } from '../login/login.page';

import { DASHBOARD_LIST_PAGE_TYPE } from '../dashboard-list/dashboard-list.page-type';
import { DASHBOARD_PAGE_TYPE } from '../dashboard/dashboard.page-type';
import { LOGIN_PAGE_TYPE } from '../login/login.page-type';

import { ROOT_PAGE_CRUMBS } from '../root/root.page-crumbs';
import { DASHBOARD_LIST_PAGE_CRUMBS } from '../dashboard-list/dashboard-list.page-crumbs';
import { DASHBOARD_PAGE_CRUMBS } from '../dashboard/dashboard.page-crumbs';
import { LOGIN_PAGE_CRUMBS } from '../login/login.page-crumbs';

export const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    handle: {
      crumbs: ROOT_PAGE_CRUMBS,
    },
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        handle: {
          crumbs: LOGIN_PAGE_CRUMBS,
          pageType: LOGIN_PAGE_TYPE,
        },
      },
      {
        path: '/dashboards',
        element: <DashboardListPage />,
        handle: {
          crumbs: DASHBOARD_LIST_PAGE_CRUMBS,
          pageType: DASHBOARD_LIST_PAGE_TYPE,
        },
      },
      {
        path: '/dashboards/:id',
        element: <DashboardPage />,
        handle: {
          crumbs: DASHBOARD_PAGE_CRUMBS,
          pageType: DASHBOARD_PAGE_TYPE,
        },
      },
    ],
  },
];
