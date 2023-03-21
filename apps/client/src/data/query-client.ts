import { QueryCache, QueryClient } from '@tanstack/react-query';

import { MINUTE_IN_MS } from '~/constants/time';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MINUTE_IN_MS * 10,
    },
  },
  queryCache: new QueryCache({}),
});
