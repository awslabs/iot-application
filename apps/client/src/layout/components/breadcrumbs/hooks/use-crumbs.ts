import invariant from 'tiny-invariant';
import { useMatches } from 'react-router-dom';

import { isJust } from '~/helpers/predicates/is-just';

import type { Crumbly, DataBound, Handleable, Maybe } from '~/types';

type MaybeMatch<T> = Maybe<DataBound<T>> & Maybe<Handleable<Maybe<Crumbly<T>>>>;

export function useCrumbs<T>() {
  const matches = useMatches() as MaybeMatch<T>[];

  invariant(matches.length >= 1, 'Expected at least 1 matching route');

  const matchesWithCrumbs = matches.filter(
    (m): m is Maybe<DataBound<T>> & Handleable<Crumbly<T>> =>
      isJust(m?.handle?.crumb),
  );

  invariant(
    matchesWithCrumbs.length >= 1,
    'Expected at least 1 matching route with crumbs',
  );

  const crumbs = matchesWithCrumbs.map((m) =>
    isJust(m.data) ? m.handle.crumb(m.data) : m.handle.crumb(),
  );

  return crumbs;
}
