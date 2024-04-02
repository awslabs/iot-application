import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
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
import { SSOLogin } from './auth/sso-login-footer';

import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';
import { AuthenticatedUserProvider } from './hooks/authentication/useAuthenticatedUser';

// Extract metadata from <meta> tags
const tags = Array.from(document.getElementsByTagName('meta'));
const metadata = extractedMetaTags(tags);
const {
  applicationName,
  authenticationFlowType,
  authMode,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsSessionToken,
  cognitoEndpoint,
  domainName,
  edgeEndpoint,
  identityPoolId,
  logMode,
  metricsMode,
  region,
  userPoolId,
  userPoolWebClientId,
  ssoProvider,
} = metadata;

if (isStringWithValue(edgeEndpoint)) {
  authService.setEdgeEndpoint(edgeEndpoint);
}

if (isStringWithValue(domainName)) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId: userPoolWebClientId,
        identityPoolId,
        loginWith: {
          oauth: {
            domain: `${domainName}.auth.${region}.amazoncognito.com`,
            redirectSignIn: [`${location.origin}/`],
            redirectSignOut: [`${location.origin}/`],
            responseType: 'code',
            scopes: ['email', 'aws.cognito.signin.user.admin'],
          },
        },
      },
    },
  });
} else {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolEndpoint: cognitoEndpoint,
        identityPoolId,
        userPoolId,
        userPoolClientId: userPoolWebClientId,
      },
    },
  });
}

if (region) {
  authService.setAwsRegion(region);
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
    const services = {
      // refer to https://ui.docs.amplify.aws/react/connected-components/authenticator/customization#override-function-calls
      async handleSignIn({
        username,
        password,
      }: {
        username: string;
        password?: string;
      }) {
        return signIn({
          username,
          password,
          options: {
            authFlowType: authenticationFlowType,
          },
        });
      },
    };

    const components = {
      SignIn: {
        Footer: () =>
          <SSOLogin
            text={`Sign in with ${ssoProvider}`}
            input={{ provider: { custom: 'IotAppApplication' } }}
          />
      }
    };

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
          <AuthenticatedUserProvider>
        <Authenticator services={services} components={components}>
            <IntlProvider locale="en" defaultLocale={DEFAULT_LOCALE}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </IntlProvider>
        </Authenticator>
          </AuthenticatedUserProvider>
      </React.StrictMode>,
    );
  }
}

registerServiceWorker();
registerLogger(logMode);
registerMetricsRecorder(metricsMode);
authService.onSignedIn(() => initializeAuthDependents(applicationName));
metricHandler.reportWebVitals();
