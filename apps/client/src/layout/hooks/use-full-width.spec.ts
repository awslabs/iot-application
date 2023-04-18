import { vi } from 'vitest';
import { renderHook } from '~/helpers/tests/testing-library';

import { useFullWidth } from './use-full-width';
import { RouteObject } from 'react-router-dom';

const useMatchesMock = vi.fn<[], RouteObject[]>();
vi.mock('react-router-dom', () => ({
  useMatches: () => useMatchesMock(),
}));

describe('useFullWidth', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true when the fullWidth predicate returns true', () => {
    useMatchesMock.mockReturnValue([
      {
        handle: {
          fullWidth: () => true,
        },
      },
    ]);
    const { result } = renderHook(() => useFullWidth());

    expect(result.current).toBe(true);
  });

  it('should return false when the fullWidth predicate returns false', () => {
    useMatchesMock.mockReturnValue([
      {
        handle: {
          fullWidth: () => false,
        },
      },
    ]);
    const { result } = renderHook(() => useFullWidth());

    expect(result.current).toBe(false);
  });

  it('should return false when there are no matches with fullWidth', () => {
    useMatchesMock.mockReturnValue([
      {
        handle: {},
      },
    ]);
    const { result } = renderHook(() => useFullWidth());

    expect(result.current).toBe(false);
  });

  it('should throw when there are no matches', () => {
    console.error = vi.fn();
    useMatchesMock.mockReturnValue([]);

    expect(() => renderHook(() => useFullWidth())).toThrow();
  });

  it('should throw when there are multiple matches with fullWidth', () => {
    console.error = vi.fn();
    useMatchesMock.mockReturnValue([
      {
        handle: {
          fullWidth: () => true,
        },
      },
      {
        handle: {
          fullWidth: () => false,
        },
      },
    ]);

    expect(() => renderHook(() => useFullWidth())).toThrow();
  });
});
