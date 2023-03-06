import {
  useCreateDashboardMutation,
  useDashboardsQuery,
  useDeleteDashboardMutation,
  usePartialUpdateDashboardMutation,
} from './dashboards.hook';
import { DashboardsTable } from './dashboards-table/dashboards-table';
import type { CreateDashboardDto } from '../services';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from 'core-types';

const DEFAULT_DASHBOARD: CreateDashboardDto = {
  name: 'Default name',
  description: 'Default description',
  definition: { widgets: [] },
};

export const DashboardsPage = () => {
  const dashboards = useDashboardsQuery();
  const createDashboardMutation = useCreateDashboardMutation();
  const partialUpdateDashboardMutation = usePartialUpdateDashboardMutation();
  const deleteDashboardMutation = useDeleteDashboardMutation();
  const navigate = useNavigate();

  const onCreateDashboard = () => {
    createDashboardMutation.mutate(DEFAULT_DASHBOARD, {
      onSuccess: (data) => {
        navigate(`/dashboards/${data.id}`);
      },
    });
  };

  const onUpdateDashboard = (
    partialDashboard: { id: string } & Partial<Dashboard>,
  ) => {
    partialUpdateDashboardMutation.mutate(partialDashboard);
  };

  const onDeleteDashboard = (id: string) => {
    deleteDashboardMutation.mutate(id);
  };

  return (
    <DashboardsTable
      dashboards={dashboards.data ?? []}
      onCreateDashboard={onCreateDashboard}
      onUpdateDashboard={onUpdateDashboard}
      onDeleteDashboard={onDeleteDashboard}
      isLoading={dashboards.isLoading}
    />
  );
};
