export type Format = 'default' | 'cards' | 'form' | 'table';

export interface Formatted {
  format: Format;
}

export type MaybeFormatted = Partial<Formatted>;
