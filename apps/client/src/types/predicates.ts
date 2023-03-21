export type TypePredicate<T, U extends T> = (a: T) => a is U;
export type NonTypePredicate<T> = (a: T) => boolean;

export type Predicate<T, U extends T> =
  | TypePredicate<T, U>
  | NonTypePredicate<T>;
