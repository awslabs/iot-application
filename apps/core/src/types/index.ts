// TODO: Move ADTs to shared package
export type Nothing = null | undefined;
export type Just<T> = T;
export type Maybe<T> = Just<T> | Nothing;

export function isNothing<T>(maybe: Maybe<T>): maybe is Nothing {
  return maybe == null;
}

export function isJust<T>(maybe: Maybe<T>): maybe is Just<T> {
  return !isNothing(maybe);
}

export interface Err<E> {
  readonly _tag: 'Err';
  readonly err: E;
}
export interface Ok<A> {
  readonly _tag: 'Ok';
  readonly ok: A;
}
export type Result<E, A> = Err<E> | Ok<A>;

export function err<E, A>(err: E): Result<E, A> {
  return { _tag: 'Err', err };
}

export function ok<E, A>(ok: A): Result<E, A> {
  return { _tag: 'Ok', ok };
}

export function isErr<E, A>(either: Result<E, A>): either is Err<E> {
  return either._tag === 'Err';
}

export function isOk<E, A>(either: Result<E, A>): either is Ok<A> {
  return either._tag === 'Ok';
}
