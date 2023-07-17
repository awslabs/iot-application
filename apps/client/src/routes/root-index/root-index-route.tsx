import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

export const rootIndexRoute = {
  index: true,
  element: <Navigate to="/dashboards" />,
} satisfies RouteObject;
