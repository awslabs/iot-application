import { ContentLayout, Header } from '@cloudscape-design/components';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARD_PATH } from '~/constants';
import { createDashboardQuery } from '~/data/dashboards';
import { queryClient } from '~/data/query-client';
import { ApiError, Dashboard } from '~/services';

import type { AsyncReturnType } from 'type-fest';

export const route = {
  path: DASHBOARD_PATH,
  element: <DashboardPage />,
  errorElement: <ErrorBoundary />,
  loader: async ({ params }) => {
    invariant(params.dashboardId, 'Expected params to include dashboard id');

    try {
      const dashboard = await queryClient.ensureQueryData(
        createDashboardQuery(params.dashboardId),
      );

      return dashboard;
    } catch (error) {
      if (error instanceof ApiError) {
        throw json({}, { status: error.status });
      }

      // unexpected error
      throw error;
    }
  },
  handle: {
    crumb: (dashboard?: Dashboard) => ({
      text: dashboard?.name ?? 'ERROR',
      href: `/dashboards/${dashboard?.id ?? ''}`,
    }),
    format: DASHBOARD_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>Looks like this one doesn't exist!</div>;
  }

  throw error;
}

export function DashboardPage() {
  const dashboard = useLoaderData() as AsyncReturnType<typeof route.loader>;

  return (
    <ContentLayout
      header={
        <Header variant="h1" description={dashboard.description}>
          {dashboard.name}
        </Header>
      }
    ></ContentLayout>
  );
}
