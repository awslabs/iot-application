import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { RouterProvider } from 'react-router-dom';

import { DEFAULT_LOCALE } from './constants';
import { router } from './router/router';

import '@cloudscape-design/global-styles/index.css';

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <IntlProvider locale="en" defaultLocale={DEFAULT_LOCALE}>
        <RouterProvider router={router} />
      </IntlProvider>
    </React.StrictMode>,
  );
}
