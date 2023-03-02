import { useRouteMatches } from '../router/route-matches.hook';
import { last } from '../func/last';

const DEFAULT_PAGE_LOCATION = '/';

export const usePageLocation = () => {
  const routeMatches = useRouteMatches();
  const routeMatch = last(routeMatches);

  return routeMatch?.pathname ?? DEFAULT_PAGE_LOCATION;
};
