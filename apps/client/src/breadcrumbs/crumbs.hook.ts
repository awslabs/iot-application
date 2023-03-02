import { PageCrumb } from './page-crumb.type';
import { NonEmptyList } from '../types/non-empty-list';
import { useRouteMatches } from '../router/route-matches.hook';

export const useCrumbs = () => {
  const routeMatches = useRouteMatches();

  return routeMatches.flatMap(
    (route) => route.handle?.crumbs,
  ) as NonEmptyList<PageCrumb>;
};
