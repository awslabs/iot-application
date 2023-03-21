import {
  createBrowserRouter,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';

import { Layout } from '../layout/layout';
import { ROOT_PATH, ROOT_HREF } from '~/constants';
import { intl } from '~/services';

import { route as indexRoute } from './index';
import { route as dashboardsRoute } from './dashboards/dashboards';

export const route = {
  path: ROOT_PATH,
  element: <Root />,
  errorElement: <RootBoundary />,
  handle: {
    activeHref: ROOT_HREF,
    crumb: () => ({
      text: intl.formatMessage({
        defaultMessage: 'IoT Application',
        description: 'root route breadcrumb text',
      }),
      href: ROOT_HREF,
    }),
  },
  children: [indexRoute, dashboardsRoute],
} satisfies Parameters<typeof createBrowserRouter>[0][number];

function RootBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>{error.error?.message}</div>;
  }

  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <div>test</div>;
}

export function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
