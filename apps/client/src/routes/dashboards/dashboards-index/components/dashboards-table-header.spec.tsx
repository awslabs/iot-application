import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { DashboardsTableHeader } from './dashboards-table-header';
import { CREATE_DASHBOARD_HREF } from '~/constants/index';

const navigateMock = vi.fn();
vi.mock('~/hooks/application/use-application', () => ({
  useApplication: () => ({
    navigate: navigateMock,
  }),
}));

describe('<DashboardsTableHeader />', () => {
  const defaultProps = {
    isDeleteDisabled: false,
    onClickDelete: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the header with the correct text', () => {
    render(<DashboardsTableHeader {...defaultProps} />);

    expect(screen.getByText('Dashboards')).toBeVisible();
  });

  it('should render the create and delete buttons', () => {
    render(<DashboardsTableHeader {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Create' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('should disable the delete button if isDeleteDisabled is true', () => {
    render(<DashboardsTableHeader {...defaultProps} isDeleteDisabled={true} />);

    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  it('should call onClickDelete when the delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardsTableHeader {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(defaultProps.onClickDelete).toHaveBeenCalledTimes(1);
  });

  it('should navigate to create dashboard page to when the create button is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardsTableHeader {...defaultProps} />);

    expect(navigateMock).toHaveBeenCalledTimes(0);

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(CREATE_DASHBOARD_HREF);
  });
});
