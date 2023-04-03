import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { DashboardErrorBoundary } from './dashboard-error-boundary';
import { ErrorBoundaryTester } from '~/helpers/tests/error-boundary-tester';

describe('<DashboardErrorBoundary />', () => {
  test('e2e error boundary usage', async () => {
    // prevent console.error from being displayed in the test output
    console.error = vi.fn();
    const user = userEvent.setup();
    render(
      <DashboardErrorBoundary>
        <ErrorBoundaryTester />
      </DashboardErrorBoundary>,
    );

    // children rendered as expected
    expect(screen.getByText('not an error fallback')).toBeVisible();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Try again' }),
    ).not.toBeInTheDocument();

    // an error occurs (simulated)
    await user.click(screen.getByRole('button', { name: 'throw error' }));

    // error fallback is rendered
    expect(screen.getByText('Something went wrong.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
    expect(screen.queryByText('not an error fallback')).not.toBeInTheDocument();

    // user resets error boundary
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    // children rendered as expected
    expect(screen.getByText('not an error fallback')).toBeVisible();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Try again' }),
    ).not.toBeInTheDocument();
  });
});
