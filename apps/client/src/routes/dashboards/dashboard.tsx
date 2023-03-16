import { useLoaderData } from 'react-router-dom';
import { DASHBOARD_DETAIL_QUERY_KEY } from './hooks/hooks';
import { ContentLayout, Header } from '@cloudscape-design/components';
import type { QueryClient } from '@tanstack/react-query';

import invariant from 'tiny-invariant';
import { readDashboard } from 'src/services';

export async function dashboardLoader(
  queryClient: QueryClient,
  dashboardId?: string,
) {
  invariant(dashboardId != null, 'Expected dashboard ID to be defined.');

  const dashboard = await queryClient.ensureQueryData({
    queryKey: DASHBOARD_DETAIL_QUERY_KEY(dashboardId),
    queryFn: () => readDashboard(dashboardId),
  });

  return dashboard;
}

export function DashboardPage() {
  const dashboard = useLoaderData() as Awaited<
    ReturnType<typeof dashboardLoader>
  >;
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
