import { useMutation } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import invariant from 'tiny-invariant';

import {
  cancelDashboardQueries,
  cancelDashboardsQueries,
  invalidateDashboards,
  invalidateDashboard,
} from '~/data/dashboards';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { updateDashboard } from '~/services';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';
import { SuccessNotification } from '~/structures/notifications/success-notification';

import type { Dashboard } from '~/services';

export function useUpdateDashboardMutation() {
  const emit = useEmitNotification();
  const intl = useIntl();

  return useMutation({
    mutationFn: ({ id, ...dto }: Dashboard) => updateDashboard(id, dto),
    onMutate: (dashboard: Dashboard) => {
      void cancelDashboardsQueries();
      void cancelDashboardQueries(dashboard.id);
    },
    onSuccess: (updatedDashboard: Dashboard) => {
      void invalidateDashboards();
      void invalidateDashboard(updatedDashboard.id);
      emit(
        new SuccessNotification(
          intl.formatMessage(
            {
              defaultMessage: 'Successfully updated dashboard "{name}".',
              description:
                'dashboard page update dashboard success notification',
            },
            { name: updatedDashboard.name },
          ),
        ),
      );
    },
    onError: (error) => {
      invariant(isApiError(error), 'Expected error to be an ApiError');
      emit(new GenericErrorNotification(error));
    },
  });
}
