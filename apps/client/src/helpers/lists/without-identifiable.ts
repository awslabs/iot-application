import { without } from './without';
import { isSameIdentifiable } from '../predicates';
import type { Identifiable } from '~/types';

export function withoutIdentifiable<T extends Identifiable>(a: T) {
  return without(isSameIdentifiable(a));
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('returns a list without the identifiable members matching the predicate', () => {
    const list = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '2' },
      { id: '1' },
    ];

    expect(withoutIdentifiable({ id: '2' })(list)).toEqual([
      { id: '1' },
      { id: '3' },
      { id: '1' },
    ]);
  });

  it('returns the same list when no members match the predicate', () => {
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];

    expect(withoutIdentifiable({ id: '4' })(list)).toEqual(list);
  });

  it('returns an empty list when given an empty list', () => {
    const list: Identifiable[] = [];

    expect(withoutIdentifiable({ id: '2' })(list)).toEqual(list);
  });
}
