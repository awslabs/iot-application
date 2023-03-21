import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router-dom';

import { DEFAULT_LOCALE } from './constants';
import { router } from './router';
import { queryClient } from './data/query-client';

import '@cloudscape-design/global-styles/index.css';

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <IntlProvider locale="en" defaultLocale={DEFAULT_LOCALE}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </IntlProvider>
    </React.StrictMode>,
  );
}
