import { useQuery } from '@tanstack/react-query';
import { MIGRATION_STATUS_QUERY } from '~/data/migration';

export function useMigrationStatusQuery() {
  return useQuery({
    ...MIGRATION_STATUS_QUERY,
    refetchInterval: 5000,
    staleTime: 0,
    gcTime: 0,
  });
}
