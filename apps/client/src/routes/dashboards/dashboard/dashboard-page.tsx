import {
  Dashboard as IoTAppKitDashboard,
  DashboardConfiguration,
} from '@iot-app-kit/dashboard';
import { Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';
import { useAtomValue } from 'jotai';

import { DashboardLoadingState } from './components/dashboard-loading-state';
import { isJust } from '~/helpers/predicates/is-just';
import { useDashboardQuery } from '~/routes/dashboards/dashboard/hooks/use-dashboard-query';
import { useUpdateDashboardMutation } from '~/routes/dashboards/dashboard/hooks/use-update-dashboard-mutation';
import './styles.css';

import type { DashboardDefinition } from '~/services';
import { useViewport } from '~/hooks/dashboard/use-viewport';
import { getDashboardEditMode } from '~/store/viewMode';

export function DashboardPage() {
  const params = useParams<{ dashboardId: string }>();

  const editMode = useAtomValue(getDashboardEditMode);

  invariant(
    isJust(params.dashboardId),
    'Expected params to include dashboard ID',
  );

  const dashboardQuery = useDashboardQuery(params.dashboardId);

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

  const awsRegion = Auth.configure().region ?? 'us-west-2';

  return (
    <IoTAppKitDashboard
      clientConfiguration={{
        awsCredentials: () => Auth.currentCredentials(),
        awsRegion,
      }}
      dashboardConfiguration={{
        ...dashboardDefinition,
        // TODO: remove display settings once dynanic sizing is released
        displaySettings: {
          numRows: 600,
          numColumns: 200,
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
