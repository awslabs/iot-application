import Flashbar from '@cloudscape-design/components/flashbar';
import { useIntl } from 'react-intl';

import { useNotifications } from '~/hooks/notifications/use-notifications';

export function Notifications() {
  const notifications = useNotifications();
  const intl = useIntl();

  return (
    <Flashbar
      items={notifications}
      stackItems={true}
      i18nStrings={{
        ariaLabel: intl.formatMessage({
          defaultMessage: 'Notifications',
          description: 'notifications aria label',
        }),
        notificationBarAriaLabel: intl.formatMessage({
          defaultMessage: 'View all notifications',
          description: 'notifications bar aria label',
        }),
        notificationBarText: intl.formatMessage({
          defaultMessage: 'Notifications',
          description: 'notifications bar text',
        }),
        errorIconAriaLabel: intl.formatMessage({
          defaultMessage: 'Error',
          description: 'error icon aria label',
        }),
        infoIconAriaLabel: intl.formatMessage({
          defaultMessage: 'Info',
          description: 'info icon aria label',
        }),
        successIconAriaLabel: intl.formatMessage({
          defaultMessage: 'Success',
          description: 'success icon aria label',
        }),
        warningIconAriaLabel: intl.formatMessage({
          defaultMessage: 'Warning',
          description: 'warning icon aria label',
        }),
        inProgressIconAriaLabel: intl.formatMessage({
          defaultMessage: 'In progress',
          description: 'in progress icon aria label',
        }),
      }}
    />
  );
}
