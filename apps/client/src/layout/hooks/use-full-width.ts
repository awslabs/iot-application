import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { isJust } from '~/helpers/predicates/is-just';

import type {
  DataBound,
  Dimensional,
  FullWidth,
  Handleable,
  Maybe,
} from '~/types';

type MaybeMatchWithDimensions<T> = Maybe<DataBound<T>> &
  Maybe<Handleable<Maybe<Dimensional<T>>>>;

/** Use to know if the current page should be rendered at full-width. */
export function useFullWidth<T>(): FullWidth {
  const matches = useMatches() as MaybeMatchWithDimensions<T>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithFullWidth = matches.filter(
    (m): m is Maybe<DataBound<T>> & Handleable<Dimensional<T>> =>
      isJust(m?.handle?.fullWidth),
  );

  invariant(
    matchesWithFullWidth.length <= 1,
    'Expected at most 1 match with dimensions',
  );

  const match = matchesWithFullWidth[0];

  return match?.handle.fullWidth(match.data) ?? false;
}
