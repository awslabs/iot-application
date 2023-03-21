import AppLayout from '@cloudscape-design/components/app-layout';
import { useIntl } from 'react-intl';

import { Breadcrumbs } from './components/breadcrumbs';
import { Notifications } from './components/notifications';
import { SideNavigation } from './components/side-navigation';
import { TopNavigation } from './components/top-navigation';

import { useFormat } from './hooks/use-format';
import { useSideNavigationVisibility } from './hooks/use-side-navigation-visibility';

export function Layout(props: React.PropsWithChildren) {
  const format = useFormat();
  const [isSideNavVisible, setIsSideNavVisible] = useSideNavigationVisibility();
  const intl = useIntl();

  return (
    <>
      <TopNavigation />
      <AppLayout
        breadcrumbs={<Breadcrumbs />}
        content={props.children}
        contentType={format}
        navigation={<SideNavigation />}
        notifications={<Notifications />}
        navigationOpen={isSideNavVisible}
        onNavigationChange={(event) => setIsSideNavVisible(event.detail.open)}
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
        }}
      />
    </>
  );
}
