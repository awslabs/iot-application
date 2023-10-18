import Button from '@cloudscape-design/components/button';
import { useMutation } from '@tanstack/react-query';
import { useIntl, FormattedMessage } from 'react-intl';
import invariant from 'tiny-invariant';
import { useSetAtom } from 'jotai';

import {
  cancelDashboardsQueries,
  invalidateDashboards,
  prefetchDashboards,
} from '~/data/dashboards';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { isFatal } from '~/helpers/predicates/is-fatal';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { useApplication } from '~/hooks/application/use-application';
import { createDashboard } from '~/services';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';
import { setDashboardEditMode } from '~/store/viewMode';

import type { Dashboard } from '~/services';

export function useCreateDashboardMutation() {
  const emit = useEmitNotification();
  const intl = useIntl();
  const { navigate } = useApplication();
  const emitEditMode = useSetAtom(setDashboardEditMode);

  return useMutation({
    mutationFn: (formData: Pick<Dashboard, 'name' | 'description'>) => {
      return createDashboard({ ...formData, definition: { widgets: [] } });
    },
    onMutate: () => {
      // abort any in progress list dashboards queries when mutation starts
      void cancelDashboardsQueries();
    },
    onSuccess: async (newDashboard) => {
      await invalidateDashboards();
      await prefetchDashboards();

      navigate(`/dashboards/${newDashboard.id}`);
      emitEditMode(true);

      emit({
        type: 'success',
        content: intl.formatMessage(
          {
            defaultMessage: 'Successfully created dashboard "{name}".',
            description: 'create dashboard success notification',
          },
          { name: newDashboard.name },
        ),
        action: (
          <Button onClick={() => navigate(`/dashboards/${newDashboard.id}`)}>
            <FormattedMessage
              defaultMessage="View dashboard"
              description="create dashboard success notification action"
            />
          </Button>
        ),
      });
    },
    onError: (error) => {
      invariant(isApiError(error), 'Expected error to be an ApiError');

      // non-fatal errors are rendered in the form
      if (isFatal(error)) {
        emit(new GenericErrorNotification(error));
      }
    },
  });
}
