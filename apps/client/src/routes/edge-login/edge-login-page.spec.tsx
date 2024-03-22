import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { EdgeLoginPage } from './edge-login-page';
import { edgeLogin } from '~/services';

const getUsernameField = () => screen.getByPlaceholderText('Enter username');
const getPasswordField = () => screen.getByPlaceholderText('Enter password');

const getSigninButton = () => screen.getByRole('button', { name: 'Sign in' });

const username = 'username';
const password = 'password';

vi.mock('~/services', () => ({
  edgeLogin: vi.fn().mockReturnValue({
    accessKey: '',
    secretAccessKey: '',
  }),
}));

const navigateMock = vi.fn();
vi.mock('~/hooks/application/use-application', () => ({
  useApplication: () => ({
    navigate: navigateMock,
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

    await user.type(getUsernameField(), username);
    expect(getUsernameField()).toHaveValue(username);

    await user.type(getPasswordField(), password);
    expect(getPasswordField()).toHaveValue(password);

    await user.click(getSigninButton());

    // Sign in successful, so should navigate to app
    expect(navigateMock).toBeCalledWith('/dashboards');
  });

  it('does not sign in if there was an api error', async () => {
    vi.resetAllMocks();
    const errorMessage = 'Incorrect username or password';
    const errorResponse = {
      response: {
        body: {
          message: errorMessage,
        },
        status: 401,
      },
      isAxiosError: true,
      toJSON: () => {
        return {};
      },
      name: '',
      message: '',
    };

    vi.mocked(edgeLogin).mockRejectedValue(errorResponse);

    const user = userEvent.setup();
    render(<EdgeLoginPage />);

    const signInText = screen.getByText('Sign in to edge gateway');
    expect(signInText).toBeInTheDocument();

    await user.type(getUsernameField(), username);
    expect(getUsernameField()).toHaveValue(username);

    await user.type(getPasswordField(), password);
    expect(getPasswordField()).toHaveValue(password);

    await user.click(getSigninButton());

    // Expect login failure
    expect(signInText).toBeInTheDocument();
  });
});
