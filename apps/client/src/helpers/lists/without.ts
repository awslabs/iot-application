import type { Predicate } from '~/types';

export function without<T, U extends T>(p: Predicate<T, U>) {
  return (as: T[]): T[] => {
    return as.filter((a) => !p(a));
  };
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('returns a list without the members matching the predicate', () => {
    const list = [1, 2, 3, 4, 5, 4, 3, 2, 1];

    expect(without((n: number) => n > 3)(list)).toEqual([1, 2, 3, 3, 2, 1]);
  });

  it('returns the same list when no members match the predicate', () => {
    const list = [1, 2, 3, 4, 5];

    expect(without((n: number) => n > 6)(list)).toEqual(list);
  });

  it('returns an empty list when given an empty list', () => {
    const list: number[] = [];

    expect(without((n: number) => n > 6)(list)).toEqual(list);
  });
}
