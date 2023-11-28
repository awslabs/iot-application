import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import AppLayout from '@cloudscape-design/components/app-layout';

import { CREATE_DASHBOARD_HREF } from '~/constants';

import { Breadcrumbs } from './components/breadcrumbs';
import { Notifications } from './components/notifications';
import { TopNavigation } from './components/top-navigation';
import { Footer } from './components/footer';

import { useFormat } from './hooks/use-format';
import { useFullWidth } from './hooks/use-full-width';

/** User interface component responsible for the application's layout. */
export function Layout(props: React.PropsWithChildren) {
  const intl = useIntl();
  const format = useFormat();
  const fullWidth = useFullWidth();
  const { pathname } = useLocation();

  const showBreadcrumb = pathname === CREATE_DASHBOARD_HREF; // show breadcrumb only for create dashboard page

  return (
    <>
      <TopNavigation />
      <AppLayout
        breadcrumbs={showBreadcrumb ? <Breadcrumbs /> : null}
        headerSelector="#h"
        footerSelector="#app-footer"
        // hide side navigation panel entirely
        navigationHide
        // hide help panel entirely
        toolsHide
        content={props.children}
        contentType={format}
        disableContentPaddings={fullWidth}
        notifications={<Notifications />}
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
      <Footer />
    </>
  );
}
