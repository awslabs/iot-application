import type { NonTypePredicate, Predicate, TypePredicate } from '~/types';

export function only<T, U extends T>(p: TypePredicate<T, U>): (as: T[]) => U[];
export function only<T>(p: NonTypePredicate<T>): (as: T[]) => T[];
export function only<T, U extends T>(p: Predicate<T, U>) {
  return (as: T[]) => {
    return as.filter(p);
  };
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('returns a list of only members matching the predicate', () => {
    const list = [1, 2, 3, 4, 5, 4, 3, 2, 1];

    expect(only((n: number) => n > 3)(list)).toEqual([4, 5, 4]);
  });

  it('returns an empty list when no members match the predicate', () => {
    const list = [1, 2, 3, 4, 5];

    expect(only((n: number) => n > 6)(list)).toEqual([]);
  });

  it('returns an empty list when given an empty list', () => {
    const list: number[] = [];

    expect(only((n: number) => n > 6)(list)).toEqual(list);
  });
}
