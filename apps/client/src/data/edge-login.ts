import { edgeLogin } from '~/services';
import { EdgeLoginBody } from '~/services/generated/models/EdgeLoginBody';

export const EDGE_LOGIN_QUERY_KEY = ['edge-login'];

// TODO: Invalidate when aws credentials expire
export function createEdgeLoginQuery(body: EdgeLoginBody) {
  return {
    queryKey: [EDGE_LOGIN_QUERY_KEY, { body }],
    queryFn: () => edgeLogin(body),
  };
}
