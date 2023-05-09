import { vi } from 'vitest';

import { signOutUnauthenticatedUser } from './query-client';
import { ApiError } from '~/services';

const signOutMock: () => Promise<void> = vi.fn();
vi.mock('aws-amplify', () => ({
  Auth: {
    signOut: () => signOutMock(),
  },
}));

describe('queryClient', () => {
  describe('global error handling', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should signout unauthenticated users on 401', () => {
      signOutUnauthenticatedUser(
        new ApiError(
          { body: null, method: 'GET', url: 'http://test.com/test' },
          {
            status: 401,
            ok: false,
            statusText: 'Unauthorized',
            url: '',
            body: null,
          },
          'Unauthorized',
        ),
      );

      expect(signOutMock).toHaveBeenCalled();
    });

    it('should not signout authenticated users on non-401 errors', () => {
      signOutUnauthenticatedUser(
        new ApiError(
          { body: null, method: 'GET', url: 'http://test.com/test' },
          {
            status: 500,
            ok: false,
            statusText: 'Internal Server Error',
            url: '',
            body: null,
          },
          'Internal Server Error',
        ),
      );

      expect(signOutMock).not.toHaveBeenCalled();
    });
  });
});
