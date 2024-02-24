import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { EdgeLoginPage } from './edge-login-page';

const getHostField = () =>
  screen.getByPlaceholderText('Enter hostname or IP address');
const getUsernameField = () => screen.getByPlaceholderText('Enter username');
const getPasswordField = () => screen.getByPlaceholderText('Enter password');

const getSigninButton = () => screen.getByRole('button', { name: 'Sign in' });

const hostName = '1.2.3.4.5';
const username = 'username';
const password = 'password';

vi.mock('./hooks/use-edge-login-query', () => ({
  useEdgeLoginQuery: vi.fn().mockReturnValue({
    refetch: vi.fn().mockReturnValue({
      data: {
        accessKey: '',
        secretKeyId: '',
      },
    }),
  }),
}));

describe('<EdgeLoginPage />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display edge login page', () => {
    render(<EdgeLoginPage />);

    const signInText = screen.getByText('Sign in to edge gateway');
    expect(signInText).toBeInTheDocument();
  });

  it('should render children when login is complete', async () => {
    const user = userEvent.setup();
    render(<EdgeLoginPage />);

    const signInText = screen.getByText('Sign in to edge gateway');
    expect(signInText).toBeInTheDocument();

    await user.type(getHostField(), hostName);
    expect(getHostField()).toHaveValue(hostName);

    await user.type(getUsernameField(), username);
    expect(getUsernameField()).toHaveValue(username);

    await user.type(getPasswordField(), password);
    expect(getPasswordField()).toHaveValue(password);

    await user.click(getSigninButton());

    // Sign in successful, so children are rendered instead of sign in page
    expect(signInText).not.toBeInTheDocument();
  });

  // TODO: error tests
});
