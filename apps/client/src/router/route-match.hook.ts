import { useMatches } from 'react-router-dom';
import { RouteMatch } from './route-match.type';

export const useRouteMatch = () => {
  const matches = useMatches();

  return matches.length > 0
    ? (matches[matches.length - 1] as RouteMatch)
    : undefined;
};
