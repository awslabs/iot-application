import { RootIndexPage } from './root-index-page';
import { ROOT_INDEX_PAGE_FORMAT } from '~/constants/format';

import type { RouteObject } from 'react-router-dom';

export const rootIndexRoute = {
  index: true,
  element: <RootIndexPage />,
  handle: {
    format: ROOT_INDEX_PAGE_FORMAT,
  },
} satisfies RouteObject;
