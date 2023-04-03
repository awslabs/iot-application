import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  isHandleableWithDimensions,
  isListWithSingleItem,
} from '~/helpers/predicates';

import type { MaybeDimensional, MaybeHandleable } from '~/types';

/** Use to know if the current page should be rendered at full-width. */
export function useFullWidth() {
  const matches = useMatches() as MaybeHandleable<MaybeDimensional>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithDimensions = matches.filter(isHandleableWithDimensions);

  invariant(
    matchesWithDimensions.length <= 1,
    'Expected at most 1 match with dimensions',
  );

  return isListWithSingleItem(matchesWithDimensions)
    ? matchesWithDimensions[0].handle.fullWidth
    : false;
}
