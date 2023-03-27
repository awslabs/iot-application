import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

import {
  updateDashboard,
  Dashboard,
  readDashboard,
  ApiError,
} from '~/services';
import { useSendNotification } from '~/hooks/notifications/use-send-notification';
import { DASHBOARD_SUMMARIES_QUERY_KEY } from '~/data/dashboards';

export function usePartialUpdateDashboardMutation() {
  const queryClient = useQueryClient();
  const sendNotification = useSendNotification();
  const intl = useIntl();

  return useMutation({
    mutationFn: async (update: Pick<Dashboard, 'id'> & Partial<Dashboard>) => {
      // get the rest of the dashboard
      const dashboard = await readDashboard(update.id);
      const { id, ...dto } = { ...dashboard, ...update };
      return updateDashboard(id, dto);
    },
    onMutate: async () => {
      // abort any in progress list dashboards queries when mutation starts
      await queryClient.cancelQueries(DASHBOARD_SUMMARIES_QUERY_KEY);
    },
    onSuccess: async (updatedDashboard: Dashboard) => {
      await queryClient.invalidateQueries(DASHBOARD_SUMMARIES_QUERY_KEY);
      sendNotification({
        type: 'success',
        content: intl.formatMessage(
          {
            defaultMessage: 'Dashboard "{name}" updated successfully.',
            description: 'update dashboard success notification content',
          },
          { name: updatedDashboard.name },
        ),
      });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        sendNotification({
          type: 'error',
          content: error.message,
        });
      }
    },
  });
}
