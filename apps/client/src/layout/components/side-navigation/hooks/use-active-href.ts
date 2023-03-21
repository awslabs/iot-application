import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { last, only } from '../../../../helpers/lists';
import {
  isHandleableWithActiveHref,
  isJust,
  isNonEmptyList,
} from '../../../../helpers/predicates';
import type { MaybeHandleable, MaybeWithActiveHref } from '../../../../types';

export function useActiveHref() {
  const matches = useMatches() as MaybeHandleable<MaybeWithActiveHref>[];

  invariant(isNonEmptyList(matches), 'Expected at least 1 match');

  const matchesWithActiveHref = only(isHandleableWithActiveHref)(matches);
  const lastMatch = last(matchesWithActiveHref);

  invariant(isJust(lastMatch), 'Expected at least 1 match with active href');

  return lastMatch.handle.activeHref;
}
