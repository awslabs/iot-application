import { useAuthenticator } from '@aws-amplify/ui-react';
import _TopNavigation from '@cloudscape-design/components/top-navigation';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { SettingsModal } from './components/settings-modal';
import { ROOT_HREF } from '~/constants';
import { preventFullPageLoad } from '~/helpers/events';
import { useApplication } from '~/hooks/application/use-application';

export function TopNavigation() {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const { navigate } = useApplication();
  const intl = useIntl();
  const { user, signOut } = useAuthenticator();

  function openSettings() {
    setIsSettingsModalVisible(true);
  }

  function closeSettings() {
    setIsSettingsModalVisible(false);
  }

  return (
    <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
      <_TopNavigation
        identity={{
          href: ROOT_HREF,
          title: intl.formatMessage({
            defaultMessage: 'IoT dashboard application',
            description: 'top navigation home link',
          }),
          onFollow: (event) => {
            preventFullPageLoad(event);
            navigate(ROOT_HREF);
          },
        }}
        utilities={[
          {
            type: 'button',
            iconName: 'settings',
            ariaLabel: intl.formatMessage({
              defaultMessage: 'Settings',
              description: 'settings button aria label',
            }),
            text: intl.formatMessage({
              defaultMessage: 'Settings',
              description: 'top navigation settings button',
            }),
            variant: 'link',
            onClick: openSettings,
          },
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

      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={closeSettings}
        key={isSettingsModalVisible.toString()}
      />
    </div>
  );
}
