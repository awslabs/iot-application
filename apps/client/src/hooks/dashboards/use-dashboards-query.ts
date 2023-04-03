import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { DASHBOARDS_QUERY } from '~/data/dashboards';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';

export function useDashboardsQuery() {
  const emit = useEmitNotification();

  return useQuery({
    ...DASHBOARDS_QUERY,
    onError: (error) => {
      invariant(isApiError(error));
      emit(new GenericErrorNotification(error));
    },
  });
}
