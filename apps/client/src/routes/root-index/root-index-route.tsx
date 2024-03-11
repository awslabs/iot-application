import { Navigate, type RouteObject } from 'react-router-dom';
import {
  ROOT_INDEX_PAGE_FORMAT,
  EDGE_LOGIN_PAGE_FORMAT,
} from '~/constants/format';

export const rootIndexRoute = {
  index: true,
  element: <Navigate to="/dashboards" />,
  handle: {
    format: ROOT_INDEX_PAGE_FORMAT,
  },
} satisfies RouteObject;

export const rootIndexEdgeRoute = {
  index: true,
  element: <Navigate to="/edge-login" />,
  handle: {
    format: EDGE_LOGIN_PAGE_FORMAT,
  },
} satisfies RouteObject;
