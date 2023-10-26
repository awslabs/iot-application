import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import { useMigrationStatusQuery } from '../hooks/use-migration-status-query';
import { UseQueryResult } from '@tanstack/react-query';
import {
  MigrationStatus,
  Status,
} from '~/services/generated/models/MigrationStatus';
import userEvent from '@testing-library/user-event';
import Migration from './migration';

const mockRefetch = vi.fn();

vi.mock('../hooks/use-migration-query', () => ({
  useMigrationQuery: () => ({
    refetch: mockRefetch,
  }),
}));

vi.mock('../hooks/use-migration-status-query');

const getMigrationButton = () =>
  screen.getByRole('button', { name: 'Migrate' });

describe('Migration', () => {
  beforeEach(() => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.NOT_STARTED,
      },
    } as UseQueryResult<MigrationStatus>);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('initial form loads', () => {
    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
  });

  test('clicking migrate button starts migration', async () => {
    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();

    await userEvent.click(getMigrationButton());

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  test('display in-progress message when migration API is in progress', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.IN_PROGRESS,
      },
    } as UseQueryResult<MigrationStatus>);

    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(screen.getByText('Migration in-progress')).toBeVisible();
  });

  test('display complete message when migration API is complete', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.COMPLETE,
      },
    } as UseQueryResult<MigrationStatus>);
    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(screen.getByText('Migration complete')).toBeVisible();
  });

  test('displays error for migration failing', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.ERROR,
        message: 'There was a migration error',
      },
    } as UseQueryResult<MigrationStatus>);
    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(
      screen.getByText(
        'There was an error during migration: There was a migration error',
      ),
    ).toBeVisible();
  });

  test('displays error for general api errors', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.IN_PROGRESS,
      },
      isError: true,
    } as UseQueryResult<MigrationStatus>);
    render(<Migration />);

    expect(
      screen.getByText('There was an error during migration'),
    ).toBeVisible();
  });
});
