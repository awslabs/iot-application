import { Dashboard as IoTAppKitDashboard } from '@iot-app-kit/dashboard';
import { Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DashboardLoadingState } from './components/dashboard-loading-state';
import { useDashboardQuery } from '~/routes/dashboards/dashboard/hooks/use-dashboard-query';
import { useUpdateDashboardMutation } from '~/routes/dashboards/dashboard/hooks/use-update-dashboard-mutation';
import './styles.css';

import type { DashboardDefinition } from '~/services';

export function DashboardPage() {
  const params = useParams<{ dashboardId: string }>();

  invariant(params.dashboardId, 'Expected params to include dashboard ID');

  const dashboardQuery = useDashboardQuery(params.dashboardId);
  const updateDashboardMutation = useUpdateDashboardMutation();

  if (dashboardQuery.isInitialLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <IoTAppKitDashboard
      clientConfiguration={{
        awsCredentials: () => Auth.currentCredentials(),
        awsRegion: 'us-west-2',
      }}
      dashboardConfiguration={{
        ...dashboardQuery.data?.definition,
        // TODO: remove display settings once dynanic sizing is released
        displaySettings: {
          numRows: 200,
          numColumns: 200,
        },
        viewport: { duration: '5m' },
      }}
      initialViewMode="preview"
      onSave={(config: DashboardDefinition) => {
        invariant(params.dashboardId, 'Expected dashboard ID to be defined');
        invariant(dashboardQuery.data, 'Expected dashboard to be loaded');

        void updateDashboardMutation.mutateAsync({
          ...dashboardQuery.data,
          id: params.dashboardId,
          definition: {
            widgets: config.widgets,
          },
        });
      }}
    />
  );
}
