import AppLayout from '@cloudscape-design/components/app-layout';
import { useIntl } from 'react-intl';

import { Breadcrumbs } from './components/breadcrumbs';
import { Notifications } from './components/notifications';
import { SideNavigation } from './components/side-navigation';
import { TopNavigation } from './components/top-navigation';

import { useFormat } from './hooks/use-format';
import { useFullWidth } from './hooks/use-full-width';
import { useNavigationVisibility } from '~/hooks/application/use-navigation-visibility';
import { useSetNavigationVisibility } from '~/hooks/application/use-set-navigation-visibility';

export function Layout(props: React.PropsWithChildren) {
  const intl = useIntl();
  const format = useFormat();
  const fullWidth = useFullWidth();
  const isNavigationVisible = useNavigationVisibility();
  const setIsNavigationVisible = useSetNavigationVisibility();

  return (
    <>
      <TopNavigation />
      <AppLayout
        breadcrumbs={<Breadcrumbs />}
        content={props.children}
        contentType={format}
        disableContentPaddings={fullWidth}
        navigation={<SideNavigation />}
        notifications={<Notifications />}
        navigationOpen={isNavigationVisible}
        onNavigationChange={(event) =>
          setIsNavigationVisible(event.detail.open)
        }
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
