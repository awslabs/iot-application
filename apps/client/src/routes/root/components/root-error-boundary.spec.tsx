import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { RootErrorBoundary } from './root-error-boundary';
import { ErrorBoundaryTester } from '~/helpers/tests/error-boundary-tester';

describe('<RootErrorBoundary />', () => {
  test('e2e error boundary usage', async () => {
    // prevent console.error from being displayed in the test output
    console.error = vi.fn();
    const user = userEvent.setup();
    render(
      <RootErrorBoundary>
        <ErrorBoundaryTester />
      </RootErrorBoundary>,
    );

    // children rendered as expected
    expect(screen.getByText('not an error fallback')).toBeVisible();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();

    // an error occurs (simulated)
    await user.click(screen.getByRole('button', { name: 'throw error' }));

    // error fallback is rendered
    expect(screen.getByText('Something went wrong.')).toBeVisible();
    expect(screen.queryByText('not an error fallback')).not.toBeInTheDocument();
  });
});
