export type FullWidth = boolean;

type GetFullWidth<T> = (data?: T) => FullWidth;

export interface Dimensional<T> {
  fullWidth: GetFullWidth<T>;
}
