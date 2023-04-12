import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { RootErrorPage } from './root-error-page';

const navigateMock = vi.fn();
vi.mock('~/hooks/application/use-application', () => ({
  useApplication: () => ({
    navigate: navigateMock,
  }),
}));

describe('<RootErrorPage />', () => {
  it('should allow user to navigate to home page', async () => {
    const user = userEvent.setup();
    render(<RootErrorPage />);

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible();

    await user.click(
      screen.getByRole('link', { name: 'IoT Application home page' }),
    );

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
