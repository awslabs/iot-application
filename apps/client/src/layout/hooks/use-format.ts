import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { isJust } from '~/helpers/predicates/is-just';

import type { Formatted, Handleable, Maybe } from '~/types';

/** Use to know what format to render to current page. */
export function useFormat() {
  const matches = useMatches() as Maybe<Handleable<Maybe<Formatted>>>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithFormat = matches.filter((m): m is Handleable<Formatted> =>
    isJust(m?.handle?.format),
  );

  return isJust(matchesWithFormat[0])
    ? matchesWithFormat[0].handle.format
    : 'default';
}
