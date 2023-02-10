import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@cloudscape-design/global-styles/index.css';

import router from './routes/router';

const rootEl = document.getElementById('root');

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
