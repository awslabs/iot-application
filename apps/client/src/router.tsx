import { createBrowserRouter } from 'react-router-dom';

import { route as rootRoute } from './routes/root';

export const routes = [rootRoute];

export const router = createBrowserRouter(routes);
