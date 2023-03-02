import { PageType } from './page-type.type';
import { useRouteMatches } from '../router/route-matches.hook';
import { last } from '../func/last';

const DEFAULT_PAGE_TYPE: PageType = 'default';

export const usePageType = () => {
  const routeMatches = useRouteMatches();
  const routeMatch = last(routeMatches);

  return routeMatch?.handle?.pageType ?? DEFAULT_PAGE_TYPE;
};
