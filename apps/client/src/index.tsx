import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Amplify } from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router-dom';

import { DEFAULT_LOCALE } from './constants';
import { router } from './router';
import { queryClient } from './data/query-client';
import type { GlobalThis } from 'type-fest';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

interface GlobalWithResources extends GlobalThis {
  awsResources: object;
}

const awsResources = (global as GlobalWithResources).awsResources;

Amplify.configure(awsResources);

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Authenticator>
        <IntlProvider locale="en" defaultLocale={DEFAULT_LOCALE}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </IntlProvider>
      </Authenticator>
    </React.StrictMode>,
  );
}
