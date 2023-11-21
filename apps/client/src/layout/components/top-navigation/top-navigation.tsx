import { useAuthenticator } from '@aws-amplify/ui-react';
import _TopNavigation from '@cloudscape-design/components/top-navigation';
import { useIntl } from 'react-intl';

import { ROOT_HREF } from '~/constants';
import { preventFullPageLoad } from '~/helpers/events';
import { useApplication } from '~/hooks/application/use-application';

export function TopNavigation() {
  const { navigate } = useApplication();
  const intl = useIntl();
  const { user, signOut } = useAuthenticator();

  return (
    <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
      <_TopNavigation
        identity={{
          href: ROOT_HREF,
          title: intl.formatMessage({
            defaultMessage: 'IoT Application',
            description: 'top navigation home link',
          }),
          onFollow: (event) => {
            preventFullPageLoad(event);
            navigate(ROOT_HREF);
          },
        }}
        utilities={[
          {
            type: 'menu-dropdown',
            text: user.username,
            description: user.attributes?.email,
            iconName: 'user-profile',
            onItemClick: (event) => {
              if (event.detail.id === 'signout') {
                signOut();
              }
            },
            items: [
              {
                id: 'documentation',
                text: intl.formatMessage({
                  defaultMessage: 'Documentation',
                  description: 'top nav documentation link',
                }),
                href: 'https://github.com/awslabs/iot-application',
                external: true,
              },
              {
                id: 'feedback',
                text: intl.formatMessage({
                  defaultMessage: 'Feedback',
                  description: 'top nav feedback link',
                }),
                href: 'https://github.com/awslabs/iot-application/issues',
                external: true,
              },
              {
                id: 'signout',
                text: intl.formatMessage({
                  defaultMessage: 'Signout',
                  description: 'top nav signout button',
                }),
              },
            ],
          },
        ]}
        i18nStrings={{
          overflowMenuTitleText: intl.formatMessage({
            defaultMessage: 'All',
            description: 'top nav overflow menu title',
          }),
          overflowMenuTriggerText: intl.formatMessage({
            defaultMessage: 'More',
            description: 'top nav overflow menu triggle',
          }),
        }}
      />
    </div>
  );
}
