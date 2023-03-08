import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { Amplify } from 'aws-amplify';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@cloudscape-design/global-styles/index.css';
import { router } from './router';
import { NotificationsProvider } from './routes/hooks/use-notifications';

const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
});

applyMode(Mode.Dark);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
  queryCache: new QueryCache({}),
});

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
