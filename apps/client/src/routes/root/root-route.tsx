import { RootPage } from './root-page';
import { rootIndexRoute } from '../root-index/index';
import { rootDashboardsRoute } from '../dashboards/root-dashboards';
import { ROOT_PATH, ROOT_HREF } from '~/constants';
import { intl } from '~/services';

import type { RouteObject } from 'react-router-dom';
import { RootErrorPage } from './root-error-page';
import { Layout } from '~/layout/layout';

export const rootRoute = {
  path: ROOT_PATH,
  element: (
    <Layout>
      <RootPage />
    </Layout>
  ),
  errorElement: (
    <Layout>
      <RootErrorPage />
    </Layout>
  ),
  handle: {
    activeHref: ROOT_HREF,
    crumb: () => ({
      text: intl.formatMessage({
        defaultMessage: 'Centurion Home',
        description: 'root route breadcrumb text',
      }),
      href: ROOT_HREF,
    }),
  },
  children: [rootIndexRoute, rootDashboardsRoute],
} satisfies RouteObject;
