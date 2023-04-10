import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { last } from '~/helpers/lists';
import { isNonEmptyList } from '~/helpers/predicates';
import { isJust } from '~/helpers/predicates/is-just';
import type { Handleable, Maybe, WithActiveHref } from '~/types';

export function useActiveHref() {
  const matches = useMatches() as Maybe<Handleable<Maybe<WithActiveHref>>>[];

  invariant(isNonEmptyList(matches), 'Expected at least 1 match');

  const matchesWithActiveHref = matches.filter(
    (m): m is Handleable<WithActiveHref> => isJust(m?.handle?.activeHref),
  );

  const lastMatch = last(matchesWithActiveHref);

  invariant(isJust(lastMatch), 'Expected at least 1 match with active href');

  return lastMatch.handle.activeHref;
}
