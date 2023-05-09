import { QueryCache, QueryClient } from '@tanstack/react-query';
import { Auth } from 'aws-amplify';
import invariant from 'tiny-invariant';

import { MINUTE_IN_MS } from '~/constants/time';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { ApiError } from '~/services';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MINUTE_IN_MS * 10,
    },
  },
  queryCache: new QueryCache({
    // global error handler
    onError: (error) => {
      // not possible to be other errors using service client
      invariant(isApiError(error), 'Expected error to be an API error');
      signOutUnauthenticatedUser(error);
    },
  }),
});

export function signOutUnauthenticatedUser(error: ApiError) {
  if (error.status === 401) {
    // TODO: create friendly sign out experience
    void Auth.signOut();
  }
}
