export interface DataBound<T> {
  data: T;
}

export type MaybeDataBound<T> = Partial<DataBound<T>>;
