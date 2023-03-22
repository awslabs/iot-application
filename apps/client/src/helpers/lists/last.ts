import type { Maybe } from '~/types';

export function last<T>(as: T[]): Maybe<T> {
  return as.at(-1);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('returns the last list element', () => {
    const list = [1, 2, 3];

    expect(last(list)).toBe(3);
  });

  it('returns undefined when given an empty list', () => {
    const list: unknown[] = [];

    expect(last(list)).toBe(undefined);
  });
}
