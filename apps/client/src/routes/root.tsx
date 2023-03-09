import { Outlet, useNavigate } from 'react-router-dom';

import { INDEX_ROUTE } from '.';
import { DASHBOARDS_ROUTE } from './dashboards/dashboards';
import { Autosuggest, TopNavigation } from '@cloudscape-design/components';
import messages from '../assets/messages';
import { DASHBOARD_SUMMARIES_QUERY_KEY } from './dashboards/hooks/hooks';
//import { Authenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { listDashboards } from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from 'src/components/settings-modal/settings-modal';

export const ROOT_ROUTE = {
  path: '/',
  element: <Root />,
  children: [INDEX_ROUTE, DASHBOARDS_ROUTE],
};

export function Root() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { SettingsModal, openSettings } = useSettings();

  const dashboards = useQuery({
    queryKey: DASHBOARD_SUMMARIES_QUERY_KEY,
    queryFn: listDashboards,
    enabled: false,
  });

  return (
    <>
      <TopNavigation
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
            onClick: openSettings,
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

      <SettingsModal />

      <Outlet />
    </>
  );
}
/*
export function Root() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <QueryClientProvider client={queryClient}>
            <TopNavigation
              identity={{
                href: '/',
                title: 'IoT Application',
              }}
              utilities={[
                {
                  type: 'menu-dropdown',
                  text: user?.username ?? 'Loading...',
                  description: user?.attributes?.email ?? 'Loading...',
                  iconName: 'user-profile',
                  items: [
                    {
                      id: 'documentation',
                      text: 'Documentation',
                      href: 'https://github.com',
                      external: true,
                      externalIconAriaLabel: ' (opens in new tab)',
                    },
                    {
                      id: 'feedback',
                      text: 'Feedback',
                      href: 'https://github.com/',
                      external: true,
                      externalIconAriaLabel: ' (opens in new tab)',
                    },
                    { id: 'signout', text: 'Sign out' },
                  ],
                  onItemClick: ({ detail }) => {
                    if (detail.id === 'signout' && signOut) {
                      signOut();
                    }
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
            />

            <Outlet />

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        );
      }}
    </Authenticator>
  );
}
*/
