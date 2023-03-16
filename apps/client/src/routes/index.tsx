import type { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { DashboardCollection } from 'src/components';
import { listDashboards } from 'src/services';

export async function dashboardsLoader(queryClient: QueryClient) {
  return await queryClient.ensureQueryData({
    queryKey: ['dashboards', 'summaries'],
    queryFn: listDashboards,
  });
}

export function IndexPage() {
  const dashboards = useLoaderData() as Awaited<
    ReturnType<typeof dashboardsLoader>
  >;

  return (
    <DashboardCollection onlyFavorites dashboards={dashboards} type="cards" />
  );
}
