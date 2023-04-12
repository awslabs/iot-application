import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { isHandleableWithFormat, isJust } from '~/helpers/predicates';

import type { MaybeFormatted, MaybeHandleable } from '~/types';

/** Use to know what format to render to current page. */
export function useFormat() {
  const matches = useMatches() as MaybeHandleable<MaybeFormatted>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithFormat = matches.filter(isHandleableWithFormat);

  return isJust(matchesWithFormat[0])
    ? matchesWithFormat[0].handle.format
    : 'default';
}
