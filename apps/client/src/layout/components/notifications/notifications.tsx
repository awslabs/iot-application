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
      }}
    />
  );
}
