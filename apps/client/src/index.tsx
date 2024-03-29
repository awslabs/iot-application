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
import { isStringWithValue } from './helpers/strings/is-string-with-value';
import { registerServiceWorker } from './register-service-worker';
import { authService } from './auth/auth-service';
import { initializeAuthDependents } from './initialize-auth-dependents';
import { registerLogger } from './register-loggers';
import { registerMetricsRecorder } from './register-metrics-recorder';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

// Extract metadata from <meta> tags
const tags = Array.from(document.getElementsByTagName('meta'));
const metadata = extractedMetaTags(tags);
const {
  applicationName,
  authMode,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsSessionToken,
  authenticationFlowType,
  cognitoEndpoint,
  domainName,
  edgeEndpoint,
  identityPoolId,
  logMode,
  metricsMode,
  region,
  userPoolId,
  userPoolWebClientId,
} = metadata;

if (isStringWithValue(edgeEndpoint)) {
  authService.setEdgeEndpoint(edgeEndpoint);
}

if (isStringWithValue(domainName)) {
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
} else {
  Amplify.configure({
    Auth: {
      authenticationFlowType,
      endpoint: cognitoEndpoint,
      identityPoolId,
      region,
      userPoolId,
      userPoolWebClientId,
    },
  });
}

// Set AWS credentials if any provided
if (awsAccessKeyId !== '' && awsSecretAccessKey !== '') {
  authService.setAwsCredentials({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    sessionToken: awsSessionToken !== '' ? awsSessionToken : undefined,
  });
}

setServiceUrl('/api');

const rootEl = document.getElementById('root');

if (authMode === 'edge') {
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
} else {
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
}

registerServiceWorker();
registerLogger(logMode);
registerMetricsRecorder(metricsMode);
authService.onSignedIn(() => initializeAuthDependents(applicationName));
metricHandler.reportWebVitals();
