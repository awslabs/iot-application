import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/router';

import {
  createDashboard,
  Dashboard,
  DashboardSummary,
  deleteDashboard,
  listDashboards,
  readDashboard,
  updateDashboard,
} from '../../../services';
import invariant from 'tiny-invariant';

export const DASHBOARDS_QUERY_KEY = ['dashboards'];
export const DASHBOARD_SUMMARIES_QUERY_KEY = [
  ...DASHBOARDS_QUERY_KEY,
  'summaries',
];
export const DASHBOARD_SUMMARY_QUERY_KEY = (id?: Dashboard['id']) => [
  ...DASHBOARD_SUMMARIES_QUERY_KEY,
  id,
];
export const DASHBOARD_DETAILS_QUERY_KEY = [...DASHBOARDS_QUERY_KEY, 'details'];
export const DASHBOARD_DETAIL_QUERY_KEY = (id?: Dashboard['id']) => [
  ...DASHBOARD_DETAILS_QUERY_KEY,
  id,
];

const invalidateDashboardSummaries = async () => {
  await queryClient.invalidateQueries({
    queryKey: DASHBOARD_SUMMARIES_QUERY_KEY,
  });
};

const setDashboardDetail = (updatedDashboard: Dashboard) => {
  queryClient.setQueryData(
    DASHBOARD_DETAIL_QUERY_KEY(updatedDashboard.id),
    updatedDashboard,
  );
};

const setDashboardSummary = (updatedDashboard: DashboardSummary) => {
  queryClient.setQueryData(
    DASHBOARD_SUMMARY_QUERY_KEY(updatedDashboard.id),
    (prevSummaries: DashboardSummary[] = []) =>
      prevSummaries.map((summary) =>
        summary.id === updatedDashboard.id ? updatedDashboard : summary,
      ),
  );
};

export const useDashboardQuery = (id?: Dashboard['id']) => {
  return useQuery({
    queryKey: DASHBOARD_DETAIL_QUERY_KEY(id),
    queryFn: () => {
      invariant(!!id, 'id expected to be defined');

      return readDashboard(id);
    },
    enabled: !!id,
  });
};

export const useDashboardsQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_SUMMARIES_QUERY_KEY,
    queryFn: listDashboards,
  });
};

export const useCreateDashboardMutation = () => {
  return useMutation({
    mutationFn: (dashboard: Omit<Dashboard, 'id'>) =>
      createDashboard(dashboard),
    onSuccess: async (newDashboard) => {
      setDashboardDetail(newDashboard);
      await invalidateDashboardSummaries();
    },
  });
};

export const usePartialUpdateDashboardMutation = () => {
  return useMutation({
    mutationFn: async (update: Pick<Dashboard, 'id'> & Partial<Dashboard>) => {
      // get the rest of the dashboard
      const dashboard = await readDashboard(update.id);
      const { id, ...dto } = { ...dashboard, ...update };
      console.table(dashboard);
      console.table(update);
      console.table(dto);
      return updateDashboard(id, dto);
    },
    onSuccess: async (updatedDashboard) => {
      setDashboardDetail(updatedDashboard);
      setDashboardSummary(updatedDashboard);
      await invalidateDashboardSummaries();
    },
  });
};

export const useUpdateDashboardMutation = () => {
  return useMutation({
    mutationFn: async (dashboard: Dashboard) => {
      const { id, ...dto } = dashboard;
      return updateDashboard(id, dto);
    },
    onSuccess: async (updatedDashboard) => {
      setDashboardDetail(updatedDashboard);
      setDashboardSummary(updatedDashboard);
      await invalidateDashboardSummaries();
    },
  });
};

export const useDeleteDashboardMutation = () => {
  return useMutation({
    mutationFn: deleteDashboard,
    onSuccess: async () => {
      await invalidateDashboardSummaries();
    },
  });
};
