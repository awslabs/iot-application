import { nanoid } from 'nanoid';

export interface IDOptions {
  length?: number;
}

/** Generates a new ID. Utilize anywhere new IDs are needed. */
export function gen(options?: IDOptions): string {
  return generateId(options);
}

function generateId(options: IDOptions = {}) {
  return nanoid(options.length);
}
