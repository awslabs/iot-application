import {
  Dashboard as IoTAppKitDashboard,
  DashboardConfiguration,
} from '@iot-app-kit/dashboard';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { DashboardLoadingState } from './components/dashboard-loading-state';
import { isJust } from '~/helpers/predicates/is-just';
import { isNotFatal } from '~/helpers/predicates/is-not-fatal';
import { useDashboardQuery } from '~/routes/dashboards/dashboard/hooks/use-dashboard-query';
import { useUpdateDashboardMutation } from '~/routes/dashboards/dashboard/hooks/use-update-dashboard-mutation';
import type { DashboardDefinition } from '~/services';
import { useViewport } from '~/hooks/dashboard/use-viewport';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { getDashboardEditMode } from '~/store/viewMode';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';

import './styles.css';
import { authService } from '~/auth/auth-service';

export function DashboardPage() {
  const params = useParams<{ dashboardId: string }>();
  const editMode = useAtomValue(getDashboardEditMode);
  const emitNotification = useEmitNotification();

  invariant(
    isJust(params.dashboardId),
    'Expected params to include dashboard ID',
  );

  const dashboardQuery = useDashboardQuery(params.dashboardId);

  useEffect(() => {
    if (dashboardQuery.isError && isNotFatal(dashboardQuery.error)) {
      emitNotification(new GenericErrorNotification(dashboardQuery.error));
    }
  }, [dashboardQuery.error, dashboardQuery.isError, emitNotification]);

  const dashboardDefinition = {
    ...dashboardQuery.data?.definition,
    widgets: dashboardQuery.data?.definition.widgets.map((widget) => {
      // legacy naming support of line-scatter-chart
      if (widget.type === 'line-scatter-chart') {
        return {
          ...widget,
          type: 'xy-plot',
        };
      }

      return widget;
    }),
    name: dashboardQuery.data?.name ?? '',
  };

  const updateDashboardMutation = useUpdateDashboardMutation();
  const [viewport, saveViewport] = useViewport(params.dashboardId);
  if (dashboardQuery.isInitialLoading) {
    return <DashboardLoadingState />;
  }

  const awsRegion = authService.awsRegion;

  return (
    <IoTAppKitDashboard
      clientConfiguration={{
        awsCredentials: () => authService.getAwsCredentials(),
        awsRegion,
      }}
      dashboardConfiguration={{
        ...dashboardDefinition,
        // TODO: remove display settings once dynanic sizing is released
        displaySettings: {
          numRows: 1000,
          numColumns: 200,
          cellSize: 20, // explicitly set a cell size so dashboard migration feature works as expected
        },
        viewport,
      }}
      initialViewMode={editMode ? 'edit' : 'preview'}
      onSave={(
        config: DashboardDefinition & Omit<DashboardConfiguration, 'widgets'>,
      ) => {
        invariant(params.dashboardId, 'Expected dashboard ID to be defined');
        invariant(dashboardQuery.data, 'Expected dashboard to be loaded');
        void updateDashboardMutation.mutateAsync({
          id: params.dashboardId,
          definition: {
            widgets: config.widgets,
          },
        });
        saveViewport(config.viewport);
      }}
    />
  );
}
