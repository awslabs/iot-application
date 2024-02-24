import { useQuery } from '@tanstack/react-query';
import { createEdgeLoginQuery } from '~/data/edge-login';
import { EdgeLoginBody } from '~/services/generated/models/EdgeLoginBody';

export function useEdgeLoginQuery(requestBody: EdgeLoginBody) {
  return useQuery({
    ...createEdgeLoginQuery(requestBody),
    refetchOnWindowFocus: false,
    enabled: false, // only call this API on button click using refetch()
    retry: false,
  });
}
