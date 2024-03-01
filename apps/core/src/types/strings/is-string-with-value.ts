const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isStringWithValue = (value: unknown): value is string => {
  return isString(value) && value !== '';
};
