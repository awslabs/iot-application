interface ResultMatchers<T, E, U, V> {
  ok: (value: T) => U;
  err: (value: E) => V;
}

const isError = <T, E>(value: T | E): value is E => {
  return value instanceof Error;
};
type TaggedOkResultValue<T> = { value: T; kind: 'ok' };
type TaggedErrResultValue<E> = { value: E; kind: 'err' };
type TaggedResultValue<T, E> = TaggedOkResultValue<T> | TaggedErrResultValue<E>;

export class Result<T, E> {
  constructor(private taggedValue: TaggedResultValue<T, E>) {}

  static ok<T, E>(value: T | E): Result<T, E> {
    return isError<T, E>(value)
      ? Result.err<T, E>(value)
      : new Result<T, E>({ value, kind: 'ok' });
  }

  static err<T, E>(value: E): Result<T, E> {
    return new Result<T, E>({ value, kind: 'err' });
  }

  static from<T, E>(value: T | E): Result<T, E> {
    return Result.ok<T, E>(value);
  }

  public map<U>(f: (value: T) => U): Result<U, E> {
    return this.isErr(this.taggedValue)
      ? Result.err<U, E>(this.taggedValue.value)
      : Result.ok<U, E>(f(this.taggedValue.value));
  }

  public match<U, V>({ ok, err }: ResultMatchers<T, E, U, V>): U | V {
    return this.isErr(this.taggedValue)
      ? err(this.taggedValue.value)
      : ok(this.taggedValue.value);
  }

  public flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E> {
    return this.isErr(this.taggedValue)
      ? Result.err<U, E>(this.taggedValue.value)
      : f(this.taggedValue.value);
  }

  private isErr(
    taggedValue: TaggedResultValue<T, E>,
  ): taggedValue is TaggedErrResultValue<E> {
    return taggedValue.kind === 'err';
  }
}
