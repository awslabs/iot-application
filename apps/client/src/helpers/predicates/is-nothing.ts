import { isJust } from '~/helpers/predicates/is-just';
import type { Maybe, Nothing } from '~/types';

export function isNothing<T>(maybe: Maybe<T>): maybe is Nothing {
  return !isJust(maybe);
}
