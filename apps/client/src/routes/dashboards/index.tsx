import { useLoaderData } from 'react-router-dom';
import { DashboardCollection } from 'src/components';
import { listDashboards } from 'src/services';

import type { QueryClient } from '@tanstack/react-query';

async function dashboardsLoader(queryClient: QueryClient) {
  return await queryClient.ensureQueryData({
    queryKey: ['dashboards', 'summaries'],
    queryFn: listDashboards,
  });
}

export function DashboardsIndexPage() {
  const dashboards = useLoaderData() as Awaited<
    ReturnType<typeof dashboardsLoader>
  >;

  return (
    <DashboardCollection
      onlyFavorites={false}
      dashboards={dashboards}
      type="table"
    />
  );
}
