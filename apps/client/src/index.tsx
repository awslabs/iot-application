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
import { setServiceUrl } from './services';
import metricHandler from './metrics/metric-handler';
import { extractedMetaTags } from './helpers/meta-tags';
import { registerServiceWorker } from './register-service-worker';
import { authService } from './auth/auth-service';
import { initializeAuthDependents } from './initialize-auth-dependents';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

// Extract metadata from <meta> tags
const tags = Array.from(document.getElementsByTagName('meta'));
const metadata = extractedMetaTags(tags);

const {
  applicationName,
  authenticationFlowType,
  cognitoEndpoint,
  identityPoolId,
  region,
  userPoolId,
  userPoolWebClientId,
  domainName,
} = metadata;

Amplify.configure({
  Auth: {
    authenticationFlowType,
    endpoint: cognitoEndpoint,
    identityPoolId,
    region,
    userPoolId,
    userPoolWebClientId,
    oauth: {
      domain: `${domainName}.auth.${region}.amazoncognito.com`,
      scope: ['email', 'aws.cognito.signin.user.admin'],
      redirectSignIn: '', // config in cognito
      redirectSignOut: '', // config in cognito
      clientId: userPoolWebClientId,
      responseType: 'token',
    },
  },
});

setServiceUrl('/api');

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

registerServiceWorker();
void authService.onSignedIn(() => initializeAuthDependents(applicationName));
metricHandler.reportWebVitals();
