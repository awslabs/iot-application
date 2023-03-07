import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { Amplify } from 'aws-amplify';

import '@cloudscape-design/global-styles/index.css';
import { router } from './router';

const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
});

applyMode(Mode.Dark);

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
