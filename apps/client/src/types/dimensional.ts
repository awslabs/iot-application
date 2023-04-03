export type FullWidth = boolean;

export interface Dimensional {
  fullWidth: FullWidth;
}

export type MaybeDimensional = Partial<Dimensional>;
