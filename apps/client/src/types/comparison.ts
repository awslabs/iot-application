import type { IsEqual } from 'type-fest';

export interface WeaklyComparable<A, B> {
  compare: (comparison: B) => IsEqual<A, B>;
}

export interface StrictlyComparable<A, B> {
  compareStrict: (comparison: B) => IsEqual<A, B>;
}
