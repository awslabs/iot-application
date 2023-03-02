import { PageType } from './page-type.type';
import { useRouteMatch } from '../router/route-match.hook';

const DEFAULT_PAGE_TYPE: PageType = 'default';

export const usePageType = () => {
  const routeMatch = useRouteMatch();

  return routeMatch?.handle?.pageType ?? DEFAULT_PAGE_TYPE;
};
