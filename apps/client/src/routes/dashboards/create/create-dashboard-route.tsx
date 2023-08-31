import { CreateDashboardPage } from './create-dashboard-page';
import { CREATE_PATH, CREATE_DASHBOARD_HREF } from '~/constants';
import { CREATE_DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { intl } from '~/services';

import type { RouteObject } from 'react-router-dom';

export const createDashboardRoute = {
  path: CREATE_PATH,
  element: <CreateDashboardPage />,
  handle: {
    crumb: () => ({
      text: intl.formatMessage({
        defaultMessage: 'Create dashboard',
        description: 'create dashboard route breadcrumb text',
      }),
      href: CREATE_DASHBOARD_HREF,
    }),
    format: CREATE_DASHBOARD_PAGE_FORMAT,
  },
} satisfies RouteObject;
