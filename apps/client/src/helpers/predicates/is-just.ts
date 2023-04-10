import type { Just, Maybe } from '~/types';

export function isJust<T>(maybe: Maybe<T>): maybe is Just<T> {
  return maybe != null;
}
