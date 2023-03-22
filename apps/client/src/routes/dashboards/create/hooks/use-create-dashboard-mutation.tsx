import Button from '@cloudscape-design/components/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useIntl, FormattedMessage } from 'react-intl';

import { DASHBOARDS_HREF } from '~/constants';
import {
  DASHBOARD_SUMMARIES_QUERY_KEY,
  DASHBOARDS_QUERY,
} from '~/data/dashboards';
import { useSendNotification } from '~/hooks/notifications/use-send-notification';
import { useBrowser } from '~/hooks/browser/use-browser';
import { ApiError, createDashboard } from '~/services';

import type { Dashboard } from '~/services';

export function useCreateDashboardMutation() {
  const queryClient = useQueryClient();
  const sendNotification = useSendNotification();
  const intl = useIntl();
  const { navigate } = useBrowser();

  return useMutation({
    mutationFn: (formData: Pick<Dashboard, 'name' | 'description'>) => {
      return createDashboard({ ...formData, definition: { widgets: [] } });
    },
    onMutate: async () => {
      // abort any in progress list dashboards queries when mutation starts
      await queryClient.cancelQueries(DASHBOARD_SUMMARIES_QUERY_KEY);
    },
    onSuccess: async (newDashboard) => {
      await queryClient.invalidateQueries(DASHBOARD_SUMMARIES_QUERY_KEY);
      await queryClient.prefetchQuery(DASHBOARDS_QUERY);

      sendNotification({
        type: 'success',
        content: intl.formatMessage(
          {
            defaultMessage: 'Successfully created dashboard "{name}".',
            description: 'create dashboard success notification',
          },
          { name: newDashboard.name },
        ),
        action: (
          <Button onClick={() => navigate(`/dashboards/${newDashboard.id}`)}>
            <FormattedMessage
              defaultMessage="View dashboard"
              description="create dashboard success notification action"
            />
          </Button>
        ),
      });

      navigate(DASHBOARDS_HREF);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status >= 500) {
          sendNotification({
            type: 'error',
            content: error.message,
          });
        }
      }
    },
  });
}
