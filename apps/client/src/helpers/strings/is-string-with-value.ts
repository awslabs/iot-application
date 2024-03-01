const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isStringWithValue = (value: unknown): value is string => {
  return isString(value) && value !== '';
};

if (import.meta.vitest) {
  it('returns true for string with value', () => {
    expect(isStringWithValue('abc')).toBe(true);
  });

  it('returns false for string with no value', () => {
    expect(isStringWithValue('')).toBe(false);
  });

  it('returns false for non-string value', () => {
    expect(isStringWithValue({})).toBe(false);
  });

  it('returns false for undefined value', () => {
    expect(isStringWithValue(undefined)).toBe(false);
  });
}
