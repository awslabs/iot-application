import { Navigate, type RouteObject } from 'react-router-dom';
import { ROOT_INDEX_PAGE_FORMAT } from '~/constants/format';

export const rootIndexRoute = {
  index: true,
  element: <Navigate to="/dashboards" />,
  handle: {
    format: ROOT_INDEX_PAGE_FORMAT,
  },
} satisfies RouteObject;
