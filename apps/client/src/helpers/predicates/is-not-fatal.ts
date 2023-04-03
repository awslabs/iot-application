import { isApiError } from './is-api-error';
import { ApiError } from '~/services';

import type { FatalStatusCode } from '~/types/fatal-status-code';

type NotFatalError = ApiError & { status: Exclude<number, FatalStatusCode> };

export function isNotFatal(error: unknown): error is NotFatalError {
  return isApiError(error) && error.status < 500;
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('should return true when given a non-fatal ApiError instance', () => {
    expect(
      isNotFatal(
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
    ).toBe(true);
  });

  it('should return false when given a fatal ApiError instance', () => {
    expect(
      isNotFatal(
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
    ).toBe(false);
  });

  it('should return false when given a non-ApiError error instance', () => {
    expect(isNotFatal(new Error('test'))).toBe(false);
  });

  it('should return false when called with null', () => {
    expect(isNotFatal(null)).toBe(false);
  });

  it('should return false when called with undefined', () => {
    expect(isNotFatal(undefined)).toBe(false);
  });
}
