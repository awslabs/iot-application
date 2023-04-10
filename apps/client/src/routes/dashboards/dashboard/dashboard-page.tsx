import { Dashboard as IoTAppKitDashboard } from '@iot-app-kit/dashboard';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DashboardLoadingState } from './components/dashboard-loading-state';
import { useDashboardQuery } from '~/routes/dashboards/dashboard/hooks/use-dashboard-query';
import { useUpdateDashboardMutation } from '~/routes/dashboards/dashboard/hooks/use-update-dashboard-mutation';
import './styles.css';

import type { Dashboard } from '~/services';
import { isJust } from '~/helpers/predicates/is-just';

export function DashboardPage() {
  const params = useParams<{ dashboardId: string }>();

  invariant(
    isJust(params.dashboardId),
    'Expected params to include dashboard ID',
  );

  const dashboardQuery = useDashboardQuery(params.dashboardId);
  const updateDashboardMutation = useUpdateDashboardMutation();

  if (dashboardQuery.isInitialLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <IoTAppKitDashboard
      clientConfiguration={{
        awsRegion: 'us-west-2',
        awsCredentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
      }}
      dashboardConfiguration={{
        ...dashboardQuery.data?.definition,
        displaySettings: {
          numRows: 200,
          numColumns: 200,
        },
        viewport: { duration: '5m' },
      }}
      onSave={(config: unknown) =>
        updateDashboardMutation.mutateAsync(config as Dashboard)
      }
    />
  );
}
