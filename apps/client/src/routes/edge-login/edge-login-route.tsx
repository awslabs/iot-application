import { type RouteObject } from 'react-router-dom';
import { EDGE_LOGIN_PAGE_FORMAT } from '~/constants/format';
import { EdgeLoginPage } from './edge-login-page';

export const edgeLoginRoute = {
  path: 'edge-login',
  element: <EdgeLoginPage />,
  handle: {
    crumb: () => ({
      text: 'Edge login',
      href: '/edge-login',
    }),
    format: EDGE_LOGIN_PAGE_FORMAT,
  },
} satisfies RouteObject;
