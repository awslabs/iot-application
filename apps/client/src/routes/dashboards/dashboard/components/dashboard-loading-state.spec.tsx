import { render, screen } from '~/helpers/tests/testing-library';
import { DashboardLoadingState } from './dashboard-loading-state';

describe('<DashboardLoadingState />', () => {
  test('renders loading state with Spinner and message', () => {
    render(<DashboardLoadingState />);

    const spinner = screen.getByRole('progressbar');
    const loadingMessage = screen.getByText('Loading dashboard');

    expect(spinner).toBeInTheDocument();
    expect(loadingMessage).toBeInTheDocument();
  });
});
