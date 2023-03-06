import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDashboard,
  CreateDashboardDto,
  Dashboard,
  deleteDashboard,
  listDashboards,
  readDashboard,
  updateDashboard,
} from 'src/services';

const DASHBOARD_QUERY_KEY = (id: string) => ['dashboard', { id }];
const DASHBOARDS_QUERY_KEY = ['dashboards'];

export const useDashboardQuery = (id: string) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY(id),
    queryFn: () => readDashboard(id),
  });
};

export const useDashboardsQuery = () => {
  return useQuery({
    queryKey: DASHBOARDS_QUERY_KEY,
    queryFn: listDashboards,
  });
};

export const useCreateDashboardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDashboardDto) => createDashboard(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
    },
  });
};

export const usePartialUpdateDashboardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      partialDashboard: { id: string } & Partial<Dashboard>,
    ) => {
      const dashboard = await readDashboard(partialDashboard.id);
      return updateDashboard(partialDashboard.id, {
        ...dashboard,
        ...partialDashboard,
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
      queryClient.setQueryData(DASHBOARD_QUERY_KEY(data.id), data);
    },
  });
};

export const useUpdateDashboardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dashboard: Dashboard) => {
      const { id, ...dto } = dashboard;
      return updateDashboard(id, dto);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
      queryClient.setQueryData(DASHBOARD_QUERY_KEY(data.id), data);
    },
  });
};

export const useDeleteDashboardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDashboard(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARDS_QUERY_KEY });
    },
  });
};
