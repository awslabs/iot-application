import AppLayout from '@cloudscape-design/components/app-layout';
import { useIntl } from 'react-intl';

import { Breadcrumbs } from './components/breadcrumbs';
import { Notifications } from './components/notifications';
import { TopNavigation } from './components/top-navigation';

import { useFormat } from './hooks/use-format';
import { useFullWidth } from './hooks/use-full-width';

/** User interface component responsible for the application's layout. */
export function Layout(props: React.PropsWithChildren) {
  const intl = useIntl();
  const format = useFormat();
  const fullWidth = useFullWidth();

  return (
    <>
      <TopNavigation />
      <AppLayout
        breadcrumbs={<Breadcrumbs />}
        headerSelector="#h"
        content={props.children}
        contentType={format}
        disableContentPaddings={fullWidth}
        notifications={<Notifications />}
        // hide side navigation panel entirely
        navigationHide={true}
        // hide help panel entirely
        toolsHide={true}
        ariaLabels={{
          navigation: intl.formatMessage({
            defaultMessage: 'Navigation drawer',
            description: 'side navigation aria label',
          }),
          navigationToggle: intl.formatMessage({
            defaultMessage: 'Open navigation drawer',
            description: 'side navigation open aria label',
          }),
          navigationClose: intl.formatMessage({
            defaultMessage: 'Close navigation drawer',
            description: 'side navigation close aria label',
          }),
          notifications: intl.formatMessage({
            defaultMessage: 'Notifications',
            description: 'notifications aria label',
          }),
        }}
      />
    </>
  );
}
