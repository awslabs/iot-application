import { Outlet } from 'react-router-dom';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { INDEX_ROUTE } from '.';
import { DASHBOARDS_ROUTE } from './dashboards/dashboards';
import { TopNavigation } from '@cloudscape-design/components';
//import { Authenticator } from '@aws-amplify/ui-react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
  queryCache: new QueryCache({}),
});

export const ROOT_ROUTE = {
  path: '/',
  element: <Root />,
  children: [INDEX_ROUTE, DASHBOARDS_ROUTE],
};

export function Root() {
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
            text: 'name',
            description: 'email',
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
      />

      <Outlet />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
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
