import { useMatches } from 'react-router-dom';
import { RouteMatch } from './route-match.type';

export const useRouteMatches = (): RouteMatch[] => {
  const matches = useMatches();

  return matches as RouteMatch[];
};
