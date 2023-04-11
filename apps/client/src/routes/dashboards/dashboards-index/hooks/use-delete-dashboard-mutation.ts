import { useMutation } from '@tanstack/react-query';
import { deleteDashboard } from '~/services';
import { invalidateDashboard } from '~/data/dashboards';

import type { DashboardSummary } from '~/services';

export function useDeleteDashboardMutation() {
  return useMutation({
    mutationFn: (dashboard: DashboardSummary) => deleteDashboard(dashboard.id),
    onSuccess: (_data, variables) => void invalidateDashboard(variables.id),
  });
}
