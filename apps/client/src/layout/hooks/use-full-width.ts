import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { isListWithSingleItem } from '~/helpers/predicates';
import { isJust } from '~/helpers/predicates/is-just';

import type { Dimensional, Handleable, Maybe } from '~/types';

/** Use to know if the current page should be rendered at full-width. */
export function useFullWidth() {
  const matches = useMatches() as Maybe<Handleable<Maybe<Dimensional>>>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithDimensions = matches.filter(
    (m): m is Handleable<Dimensional> => isJust(m?.handle?.fullWidth),
  );

  invariant(
    matchesWithDimensions.length <= 1,
    'Expected at most 1 match with dimensions',
  );

  return isListWithSingleItem(matchesWithDimensions)
    ? matchesWithDimensions[0].handle.fullWidth
    : false;
}
