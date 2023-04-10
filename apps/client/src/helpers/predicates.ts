import type { ReadonlyTuple } from 'type-fest';
import type { Identifiable, NonEmptyList } from '~/types';

export function isListWithSingleItem<T>(
  list: Readonly<T[]>,
): list is ReadonlyTuple<T, 1> {
  return list.length === 1;
}

export function isSameIdentifiable(a: Identifiable) {
  return (b: Identifiable) => {
    return a.id === b.id;
  };
}

export function isNonEmptyList<T>(maybe: T[]): maybe is NonEmptyList<T> {
  return maybe.length >= 1;
}
