import { useQuery } from '@tanstack/react-query';

import { createDashboardQuery } from '~/data/dashboards';
import { isFatal } from '~/helpers/predicates/is-fatal';

import type { Dashboard } from '~/services';

export function useDashboardQuery(dashboardId: Dashboard['id']) {
  return useQuery({
    ...createDashboardQuery(dashboardId),
    throwOnError: isFatal,
  });
}
