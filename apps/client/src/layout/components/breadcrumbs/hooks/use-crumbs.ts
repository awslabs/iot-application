import invariant from 'tiny-invariant';
import { useMatches } from 'react-router-dom';

import {
  isHandleableWithCrumbData,
  isHandleableWithCrumbs,
} from '~/helpers/predicates';
import type { MaybeCrumbly, MaybeDataBound, MaybeHandleable } from '~/types';

type MaybeMatch<T> = MaybeDataBound<T> & MaybeHandleable<MaybeCrumbly<T>>;

export function useCrumbs<T>() {
  const matches = useMatches() as MaybeMatch<T>[];

  invariant(matches.length >= 1, 'Expected at least 1 matching route');

  const matchesWithCrumbs = matches.filter(isHandleableWithCrumbs);

  invariant(
    matchesWithCrumbs.length >= 1,
    'Expected at least 1 matching route with crumbs',
  );

  const crumbs = matchesWithCrumbs.map((m) =>
    isHandleableWithCrumbData(m) ? m.handle.crumb(m.data) : m.handle.crumb(),
  );

  return crumbs;
}
