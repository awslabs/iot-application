import { useRouteMatch } from '../router/route-match.hook';

const DEFAULT_PAGE_LOCATION = '/';

export const usePageLocation = () => {
  const routeMatch = useRouteMatch();

  return routeMatch?.pathname ?? DEFAULT_PAGE_LOCATION;
};
