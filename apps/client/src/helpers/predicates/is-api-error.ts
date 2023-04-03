import { ApiError } from '~/services';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('should return true when given an ApiError instance', () => {
    expect(
      isApiError(
        new ApiError(
          { method: 'GET', url: 'test' },
          {
            url: 'test',
            ok: false,
            status: 500,
            statusText: 'test',
            body: 'test',
          },
          'test',
        ),
      ),
    ).toBe(true);
  });

  it('should return false when given a non-ApiError error instance', () => {
    expect(isApiError(new Error('test'))).toBe(false);
  });

  it('should return false when called with null', () => {
    expect(isApiError(null)).toBe(false);
  });

  it('should return false when called with undefined', () => {
    expect(isApiError(undefined)).toBe(false);
  });

  it('should return false when called with a non-ApiError object', () => {
    expect(isApiError({})).toBe(false);
  });
}
