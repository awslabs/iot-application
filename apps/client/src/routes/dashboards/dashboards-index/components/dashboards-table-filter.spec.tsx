import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import { DashboardsTableFilter } from './dashboards-table-filter';
import userEvent from '@testing-library/user-event';

describe('<DashboardsTableFilter />', () => {
  const defaultProps = {
    count: 0,
    onChange: vi.fn(),
    filteringText: '',
  };

  it('should render the filter with the correct text', () => {
    render(<DashboardsTableFilter {...defaultProps} />);

    expect(screen.getByRole('searchbox')).toBeVisible();
    expect(screen.getByPlaceholderText('Find dashboards')).toBeVisible();
  });

  it('should render the filtering text', () => {
    render(<DashboardsTableFilter {...defaultProps} filteringText="test" />);

    expect(screen.getByDisplayValue('test')).toBeVisible();
  });

  it('should call onChange when the filter input is changed', async () => {
    const user = userEvent.setup();
    render(<DashboardsTableFilter {...defaultProps} />);

    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.type(screen.getByRole('searchbox'), 'test');

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('should call onChange when the clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardsTableFilter {...defaultProps} filteringText="test" />);

    // resetAllMocks is needed because the onChange is called when the component is rendered
    vi.resetAllMocks();
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Clear filter' }));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('should not render clear button when filtering text is empty', () => {
    render(<DashboardsTableFilter {...defaultProps} />);

    expect(
      screen.queryByRole('button', { name: 'Clear filter' }),
    ).not.toBeInTheDocument();
  });

  it('should render clear button when filtering text is not empty', () => {
    render(<DashboardsTableFilter {...defaultProps} filteringText="test" />);

    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeVisible();
  });

  it('should render 0 count', () => {
    render(<DashboardsTableFilter {...defaultProps} filteringText="test" />);

    expect(screen.getByText('0 matches')).toBeVisible();
  });

  it('should render singular count', () => {
    render(
      <DashboardsTableFilter
        {...defaultProps}
        filteringText="test"
        count={1}
      />,
    );

    expect(screen.getByText('1 match')).toBeVisible();
  });

  it('should render plural count', () => {
    render(
      <DashboardsTableFilter
        {...defaultProps}
        filteringText="test"
        count={2}
      />,
    );

    expect(screen.getByText('2 matches')).toBeVisible();
  });
});
