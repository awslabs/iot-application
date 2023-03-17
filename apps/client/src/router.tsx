import { QueryCache, QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import { Root } from './routes/root';
import { IndexPage, dashboardsLoader } from './routes';
import { DashboardsPage } from './routes/dashboards/dashboards';
import { DashboardsIndexPage } from './routes/dashboards';
import { CreateDashboardPage } from './routes/dashboards/new';
import { DashboardPage, dashboardLoader } from './routes/dashboards/dashboard';
import type { Dashboard } from 'src/services';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
  queryCache: new QueryCache({}),
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    handle: {
      activeHref: '/',
      crumb: () => ({ text: 'Home', href: '/' }),
    },
    children: [
      {
        index: true,
        element: <IndexPage />,
        loader: () => dashboardsLoader(queryClient),
        handle: {
          format: 'cards',
        },
      },
      {
        path: 'dashboards',
        element: <DashboardsPage />,
        handle: {
          activeHref: '/dashboards',
          crumb: () => ({ text: 'Dashboards', href: '/dashboards' }),
        },
        children: [
          {
            index: true,
            element: <DashboardsIndexPage />,
            loader: () => dashboardsLoader(queryClient),
            handle: {
              format: 'table',
            },
          },
          {
            path: 'create',
            element: <CreateDashboardPage />,
            handle: {
              crumb: () => ({ text: 'Create', href: '/dashboards/create' }),
              format: 'form',
            },
          },
          {
            path: ':dashboardId',
            element: <DashboardPage />,
            loader: ({ params }) =>
              dashboardLoader(queryClient, params.dashboardId),
            handle: {
              crumb: (dashboard: Dashboard) => {
                return {
                  text: dashboard.name,
                  href: `/dashboards/${dashboard.id}`,
                };
              },
              format: 'default',
            },
          },
        ],
      },
    ],
  },
]);
