import type { StrictlyComparable, WeaklyComparable } from 'src/types';

export function compare<A, B>(
  comparable: WeaklyComparable<A, B>,
  comparison: B,
) {
  return comparable.compare(comparison);
}

export function compareStrict<A, B>(
  comparable: StrictlyComparable<A, B>,
  comparsion: B,
) {
  return comparable.compareStrict(comparsion);
}
