import { useMutation } from '@tanstack/react-query';
import { bulkDeleteDashboards } from '~/services';
import { invalidateDashboards } from '~/data/dashboards';

export function useDeleteDashboardMutation() {
  return useMutation({
    mutationFn: bulkDeleteDashboards,
    onSuccess: () => void invalidateDashboards(),
  });
}
