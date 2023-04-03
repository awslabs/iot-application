import { isApiError } from './is-api-error';
import { ApiError } from '~/services';

import type { FatalStatusCode } from '~/types/fatal-status-code';

type FatalError = ApiError & { status: FatalStatusCode };

export function isFatal(error: unknown): error is FatalError {
  return isApiError(error) && error.status >= 500;
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('should return true when given a fatal ApiError instance', () => {
    expect(
      isFatal(
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

  it('should return false when given a non-fatal ApiError instance', () => {
    expect(
      isFatal(
        new ApiError(
          { method: 'GET', url: 'test' },
          {
            url: 'test',
            ok: false,
            status: 400,
            statusText: 'test',
            body: 'test',
          },
          'test',
        ),
      ),
    ).toBe(false);
  });

  it('should return false when given a non-ApiError error instance', () => {
    expect(isFatal(new Error('test'))).toBe(false);
  });

  it('should return false when called with null', () => {
    expect(isFatal(null)).toBe(false);
  });

  it('should return false when called with undefined', () => {
    expect(isFatal(undefined)).toBe(false);
  });

  it('should return false when called with a non-ApiError object', () => {
    expect(isFatal({})).toBe(false);
  });
}
