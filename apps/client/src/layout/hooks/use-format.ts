import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  isHandleableWithFormat,
  isListWithSingleItem,
} from '~/helpers/predicates';

import type { MaybeFormatted, MaybeHandleable } from '~/types';

export function useFormat() {
  const matches = useMatches() as MaybeHandleable<MaybeFormatted>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithFormat = matches.filter(isHandleableWithFormat);

  if (!isListWithSingleItem(matchesWithFormat)) {
    invariant(false, 'Expected only 1 match with format');
  }

  return matchesWithFormat[0].handle.format;
}
