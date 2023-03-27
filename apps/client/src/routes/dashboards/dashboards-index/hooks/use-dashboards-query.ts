import { useQuery } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

import { DASHBOARDS_QUERY } from '~/data/dashboards';
import { useSendNotification } from '~/hooks/notifications/use-send-notification';
import { ApiError } from '~/services';

export function useDashboardsQuery() {
  const intl = useIntl();
  const sendNotification = useSendNotification();

  return useQuery({
    ...DASHBOARDS_QUERY,
    onError: (error) => {
      if (error instanceof ApiError) {
        sendNotification({
          type: 'error',
          content: intl.formatMessage({
            defaultMessage: error.message,
            description: 'list dashboards error notification content',
          }),
        });
      }
    },
  });
}
