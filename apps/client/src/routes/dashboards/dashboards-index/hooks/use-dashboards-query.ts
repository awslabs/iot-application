import { useQuery } from '@tanstack/react-query';

import { DASHBOARDS_QUERY } from '~/data/dashboards';

export function useDashboardsQuery() {
  return useQuery({
    ...DASHBOARDS_QUERY,
  });
}
