import { dashboardMigration, dashboardMigrationStatus } from '~/services';

export const MIGRATION_QUERY_KEY = ['migration'];

export const MIGRATION_START_QUERY_KEY = [...MIGRATION_QUERY_KEY, 'start'];

export const MIGRATION_STATUS_QUERY_KEY = [...MIGRATION_QUERY_KEY, 'status'];

export const MIGRATION_QUERY = {
  queryKey: MIGRATION_START_QUERY_KEY,
  queryFn: async () => {
    await dashboardMigration();
    return {};
  },
};

export const MIGRATION_STATUS_QUERY = {
  queryKey: MIGRATION_STATUS_QUERY_KEY,
  queryFn: dashboardMigrationStatus,
};
