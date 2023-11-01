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
import { SuccessNotification } from '~/structures/notifications/success-notification';
import { LoadingNotification } from '~/structures/notifications/loading-notification';
import { ErrorNotification } from '~/structures/notifications/error-notification';

const mockRefetch = vi.fn();
const mockEmit = vi.fn();
const onMigrate = vi.fn();

vi.mock('../hooks/use-migration-query', () => ({
  useMigrationQuery: () => ({
    refetch: mockRefetch,
  }),
}));

vi.mock('../hooks/use-migration-status-query');

vi.mock('~/hooks/notifications/use-emit-notification', () => ({
  useEmitNotification: () => mockEmit,
}));

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
    render(<Migration onMigrationComplete={onMigrate} />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
  });

  test('clicking migrate button starts migration', async () => {
    render(<Migration onMigrationComplete={onMigrate} />);

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

    render(<Migration onMigrationComplete={onMigrate} />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(mockEmit).toHaveBeenCalledWith(
      new LoadingNotification('Migration in-progress'),
    );
  });

  test('display complete message when migration API is complete', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.COMPLETE,
      },
    } as UseQueryResult<MigrationStatus>);
    render(<Migration onMigrationComplete={onMigrate} />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(mockEmit).toHaveBeenCalledWith(
      new SuccessNotification('Migration complete'),
    );
    expect(onMigrate).toHaveBeenCalled();
  });

  test('displays error for migration failing', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.ERROR,
        message: 'There was a migration error',
      },
    } as UseQueryResult<MigrationStatus>);
    render(<Migration onMigrationComplete={onMigrate} />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
    expect(mockEmit).toHaveBeenCalledWith(
      new ErrorNotification(
        'There was an error during migration: There was a migration error',
      ),
    );
  });

  test('displays error for general api errors', () => {
    vi.mocked(useMigrationStatusQuery).mockReturnValue({
      data: {
        status: Status.IN_PROGRESS,
      },
      isError: true,
    } as UseQueryResult<MigrationStatus>);
    render(<Migration onMigrationComplete={onMigrate} />);

    expect(mockEmit).toHaveBeenCalledWith(
      new ErrorNotification('There was an error during migration'),
    );
  });
});
