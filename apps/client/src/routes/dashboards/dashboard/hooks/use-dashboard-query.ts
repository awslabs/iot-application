import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { createDashboardQuery } from '~/data/dashboards';
import { isFatal } from '~/helpers/predicates/is-fatal';
import { isNotFatal } from '~/helpers/predicates/is-not-fatal';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';

import type { Dashboard } from '~/services';

export function useDashboardQuery(dashboardId: Dashboard['id']) {
  const emit = useEmitNotification();

  return useQuery({
    ...createDashboardQuery(dashboardId),
    useErrorBoundary: isFatal,
    onError: (error) => {
      invariant(
        isNotFatal(error),
        'Expected fatal error to be handled by error boundary',
      );
      emit(new GenericErrorNotification(error));
    },
  });
}
