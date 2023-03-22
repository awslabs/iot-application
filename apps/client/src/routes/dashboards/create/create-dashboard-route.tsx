import { createBrowserRouter } from 'react-router-dom';

import { CREATE_PATH, CREATE_DASHBOARD_HREF } from '~/constants';
import { CREATE_DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { intl } from '~/services';
import { CreateDashboardPage } from './create-dashboard-page';

export const createDashboardRoute = {
  path: CREATE_PATH,
  element: <CreateDashboardPage />,
  handle: {
    crumb: () => ({
      text: intl.formatMessage({
        defaultMessage: 'Create',
        description: 'create dashboard route breadcrumb text',
      }),
      href: CREATE_DASHBOARD_HREF,
    }),
    format: CREATE_DASHBOARD_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];
