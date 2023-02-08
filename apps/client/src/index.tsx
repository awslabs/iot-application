import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import '@cloudscape-design/global-styles/index.css';

import router from './routes/router';
import './styles/index.css';

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
