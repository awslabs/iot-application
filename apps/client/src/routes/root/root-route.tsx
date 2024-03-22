import { RootPage } from './root-page';
import { rootIndexRoute, rootIndexEdgeRoute } from '../root-index/index';
import { rootDashboardsRoute } from '../dashboards/root-dashboards';
import { edgeLoginRoute } from '../edge-login/edge-login-route';
import { ROOT_PATH, ROOT_HREF } from '~/constants';
import { getAuthMode } from '~/helpers/authMode';

import type { RouteObject } from 'react-router-dom';
import { RootErrorPage } from './root-error-page';
import { Layout } from '~/layout/layout';
import { intl } from '~/services';

let children: RouteObject[] = [rootIndexRoute, rootDashboardsRoute];

if (getAuthMode() === 'edge') {
  children = [
    rootIndexEdgeRoute,
    edgeLoginRoute,
    rootIndexRoute,
    rootDashboardsRoute,
  ];
}

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
        defaultMessage: 'Home',
        description: 'root route breadcrumb text',
      }),
      href: ROOT_HREF,
    }),
  },
  children,
} satisfies RouteObject;
