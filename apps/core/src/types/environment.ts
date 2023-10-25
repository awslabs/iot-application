export type Undefined = undefined | 'undefined';
export type Defined<T> = T;
export type Maybe<T> = Defined<T> | Undefined;

export function isUndefined<T>(maybe: Maybe<T>): maybe is Undefined {
  return maybe === undefined || maybe === 'undefined';
}

export function isDefined<T>(maybe: Maybe<T>): maybe is Defined<T> {
  return !isUndefined(maybe);
}

export function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}
