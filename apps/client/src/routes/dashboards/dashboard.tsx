import { ContentLayout, Header } from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';
import { createBrowserRouter, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DASHBOARD_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARD_PATH } from '~/constants';
import { createDashboardQuery } from '~/data/dashboards';

export const route = {
  path: DASHBOARD_PATH,
  element: <DashboardPage />,
  handle: {
    crumb: () => ({
      // TODO: replace with real dashboard name
      text: 'Dashboard',
      href: '',
    }),
    format: DASHBOARD_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];

export function DashboardPage() {
  const params = useParams<{ dashboardId: string }>();

  invariant(params.dashboardId, 'Expected params to include dashboard ID');

  const dashboardQuery = useQuery(createDashboardQuery(params.dashboardId));

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description={dashboardQuery.data?.description ?? ''}
        >
          {dashboardQuery.data?.name ?? ''}
        </Header>
      }
    ></ContentLayout>
  );
}
