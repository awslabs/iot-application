import { createBrowserRouter } from 'react-router-dom';

import { rootRoute } from './routes/root';

export const routes = [rootRoute];

export const router = () => createBrowserRouter(routes);
