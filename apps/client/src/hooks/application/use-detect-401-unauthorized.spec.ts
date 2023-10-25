import { vi } from 'vitest';
import { renderHook } from '~/helpers/tests/testing-library';
import { useDetect401Unauthorized } from './use-detect-401-unauthorized';

const signOutMock = vi.fn<[], unknown>();
vi.mock('aws-amplify', () => ({
  Auth: {
    signOut: () => signOutMock(),
  },
}));

describe('test', () => {
  beforeAll(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call signout when "401_UNAUTHORIZED" is received', () => {
    renderHook(() => useDetect401Unauthorized());

    // Get the callback passed to addEventListener
    const eventHandler = (
      navigator.serviceWorker.addEventListener as ReturnType<typeof vi.fn>
    ).mock.calls[0]?.[1] as (args: { data: { type: string } }) => void;

    // Simulate a service worker message
    eventHandler({ data: { type: '401_UNAUTHORIZED' } });

    // Verify Auth.signOut was called
    expect(signOutMock).toHaveBeenCalled();
  });

  it('should not call signout when "401_UNAUTHORIZED" is not received', () => {
    renderHook(() => useDetect401Unauthorized());

    const eventHandler = (
      navigator.serviceWorker.addEventListener as ReturnType<typeof vi.fn>
    ).mock.calls[0]?.[1] as (args: unknown) => void;

    eventHandler({ data: { type: 'SOMETHING_ELSE' } });

    expect(signOutMock).not.toHaveBeenCalled();

    eventHandler({ data: 'hello' });

    expect(signOutMock).not.toHaveBeenCalled();
  });
});
