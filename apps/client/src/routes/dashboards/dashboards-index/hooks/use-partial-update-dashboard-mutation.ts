import { DashboardSummary } from 'src/services';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import invariant from 'tiny-invariant';

import {
  cancelDashboardQueries,
  cancelDashboardsQueries,
  invalidateDashboard,
  invalidateDashboards,
} from '~/data/dashboards';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { updateDashboard, readDashboard } from '~/services';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';
import { SuccessNotification } from '~/structures/notifications/success-notification';

import type { Dashboard } from '~/services';

type PartialDashboardUpdate = Pick<DashboardSummary, 'id'> &
  Partial<Pick<DashboardSummary, 'name' | 'description'>>;

export function usePartialUpdateDashboardMutation() {
  const emit = useEmitNotification();
  const intl = useIntl();

  return useMutation({
    mutationFn: async (update: PartialDashboardUpdate) => {
      // TODO: Update API to enable partial updates
      // get the rest of the dashboard
      const dashboard = await readDashboard(update.id);
      const { id, ...dto } = { ...dashboard, ...update };
      return updateDashboard(id, dto);
    },
    onMutate: (updatingDashboard) => {
      void cancelDashboardsQueries();
      void cancelDashboardQueries(updatingDashboard.id);
    },
    onSuccess: (updatedDashboard: Dashboard) => {
      void invalidateDashboards();
      void invalidateDashboard(updatedDashboard.id);
      emit(
        new SuccessNotification(
          intl.formatMessage(
            {
              defaultMessage: 'Dashboard "{name}" updated successfully.',
              description: 'update dashboard success notification content',
            },
            { name: updatedDashboard.name },
          ),
        ),
      );
    },
    onError: (error) => {
      invariant(isApiError(error));
      emit(new GenericErrorNotification(error));
    },
  });
}
