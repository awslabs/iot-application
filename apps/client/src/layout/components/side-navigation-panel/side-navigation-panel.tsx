import {
  Badge,
  SideNavigation,
  SideNavigationProps,
} from '@cloudscape-design/components';
import { useIntl } from 'react-intl';

import { DASHBOARDS_HREF } from '~/constants';

export const SideNavigationPanel = () => {
  const intl = useIntl();

  const header: SideNavigationProps['header'] = {
    text: intl.formatMessage({
      defaultMessage: 'Centurion Home',
      description: 'Centurion Home link',
    }),
    href: DASHBOARDS_HREF,
  };

  const items: SideNavigationProps['items'] = [
    {
      type: 'link',
      text: intl.formatMessage({
        defaultMessage: 'Dashboards',
        description: 'Dashboard link',
      }),
      href: DASHBOARDS_HREF,
    },
    {
      type: 'link',
      text: intl.formatMessage({
        defaultMessage: 'Templating',
        description: 'Templating link',
      }),
      href: '#/templating',
    },
    { type: 'divider' },
    {
      type: 'link',
      text: intl.formatMessage({
        defaultMessage: 'Notifications',
        description: 'Notifications link',
      }),
      href: '#/notifications',
      info: <Badge color="red">22</Badge>,
    },
    {
      type: 'link',
      text: intl.formatMessage({
        defaultMessage: 'Documentation',
        description: 'Documentation link',
      }),
      href: '#/documentation',
      external: true,
    },
  ];

  return (
    <SideNavigation
      items={items}
      header={header}
      activeHref={DASHBOARDS_HREF}
    />
  );
};
