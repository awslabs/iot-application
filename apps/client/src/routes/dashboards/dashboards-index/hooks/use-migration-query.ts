import { useQuery } from '@tanstack/react-query';
import { MIGRATION_QUERY } from '~/data/migration';

export function useMigrationQuery() {
  return useQuery({
    ...MIGRATION_QUERY,
    refetchOnWindowFocus: false,
    enabled: false, // only call this API on button click once using refetch()
  });
}
