import Autosuggest from '@cloudscape-design/components/autosuggest';
import _TopNavigation from '@cloudscape-design/components/top-navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { listDashboards } from 'src/services';
import { SettingsModal } from 'src/components';
import messages from 'src/assets/messages';

export function TopNavigation() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const dashboards = useQuery({
    queryKey: ['dashboards', 'summaries'],
    queryFn: listDashboards,
    enabled: false,
  });

  return (
    <>
      <_TopNavigation
        identity={{
          href: '/',
          title: messages.appName,
          onFollow: (event) => {
            event.preventDefault();
            navigate('/');
          },
        }}
        utilities={[
          {
            type: 'button',
            iconName: 'settings',
            ariaLabel: 'Settings',
            text: 'Settings',
            variant: 'link',
            onClick: () => setIsSettingsModalVisible(true),
          },
          {
            type: 'menu-dropdown',
            text: 'name',
            description: 'email',
            iconName: 'user-profile',
            items: [
              {
                id: 'documentation',
                text: 'Documentation',
                href: 'https://github.com/awslabs/iot-application',
                external: true,
                externalIconAriaLabel: ' (opens in new tab)',
              },
              {
                id: 'feedback',
                text: 'Feedback',
                href: 'https://github.com/awslabs/iot-application/issues',
                external: true,
                externalIconAriaLabel: ' (opens in new tab)',
              },
              { id: 'signout', text: 'Sign out' },
            ],
            onItemClick: ({ detail }) => {
              console.log(detail);
            },
          },
        ]}
        i18nStrings={{
          searchIconAriaLabel: 'Search',
          searchDismissIconAriaLabel: 'Close search',
          overflowMenuTriggerText: 'More',
          overflowMenuTitleText: 'All',
          overflowMenuBackIconAriaLabel: 'Back',
          overflowMenuDismissIconAriaLabel: 'Close menu',
        }}
        search={
          <Autosuggest
            options={dashboards.data?.map((d) => ({
              value: d.id,
              label: d.name,
              description: d.description,
            }))}
            statusType={dashboards.isLoading ? 'loading' : 'finished'}
            placeholder="Find dashboard"
            onSelect={(event) => {
              const selectedDashboard = dashboards.data?.find(
                (d) => d.id === event.detail.value,
              );

              if (selectedDashboard) {
                setSearchText(selectedDashboard.name);
                navigate(`/dashboards/${selectedDashboard.id}`);
              }
            }}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.detail.value);
            }}
            enteredTextLabel={(value) => `Name: ${value}`}
            onLoadItems={() => {
              void dashboards.refetch();
            }}
            loadingText="Loading dashboards"
            empty="No dashboards found"
          />
        }
      />

      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
      />
    </>
  );
}
