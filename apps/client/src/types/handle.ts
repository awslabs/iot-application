export type Handle<T> = T;

export interface Handleable<T> {
  handle: Handle<T>;
}

export type MaybeHandleable<T> = Partial<Handleable<T>>;
