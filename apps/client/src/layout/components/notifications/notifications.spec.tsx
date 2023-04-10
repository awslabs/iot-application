import { vi } from 'vitest';
import {
  render,
  screen,
  within,
  waitFor,
} from '~/helpers/tests/testing-library';

import { Notifications } from './notifications';
import type { NotificationViewModel } from '~/types/notification-view-model';
import userEvent from '@testing-library/user-event';

const useNotificationsMock = vi.fn<[], NotificationViewModel[]>();
vi.mock('~/hooks/notifications/use-notifications', () => ({
  useNotifications: () => useNotificationsMock(),
}));

describe('<Notifications />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should not render notifications when there are none', () => {
    useNotificationsMock.mockReturnValueOnce([]);
    render(<Notifications />);
    const notificationsList = screen.getByRole('list', {
      name: 'Notifications',
    });
    const notifications = within(notificationsList).queryAllByRole('listitem');

    expect(notifications.length).toBe(0);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Notifications' }),
    ).not.toBeInTheDocument();
  });

  it('should render a single notification', () => {
    useNotificationsMock.mockReturnValueOnce([
      {
        id: '1',
        content: 'notification',
        type: 'info',
      },
    ]);
    render(<Notifications />);
    const notificationsList = screen.getByRole('list', {
      name: 'Notifications',
    });
    const notifications = within(notificationsList).queryAllByRole('listitem');

    expect(notifications.length).toBe(1);
    expect(notifications.at(0)).toHaveTextContent('notification');
    expect(notifications.at(0)).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Notifications' }),
    ).not.toBeInTheDocument();
  });

  it('should only render a single notification when stacked', () => {
    useNotificationsMock.mockReturnValueOnce([
      {
        id: '1',
        content: 'notification a',
        type: 'info',
      },
      {
        id: '2',
        content: 'notification b',
        type: 'info',
      },
    ]);
    render(<Notifications />);
    const notificationsList = screen.getByRole('list', {
      name: 'Notifications',
    });
    const notifications = within(notificationsList).queryAllByRole('listitem');

    expect(notifications.length).toBe(1);
    expect(screen.getByRole('status')).toBeVisible();
    expect(screen.getByText('notification a')).toBeVisible();
    expect(screen.queryByText('notification b')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Notifications' }),
    ).toBeVisible();
  });

  it('should render multiple notifications when not stacked', async () => {
    useNotificationsMock.mockReturnValueOnce([
      {
        id: '1',
        content: 'notification a',
        type: 'info',
      },
      {
        id: '2',
        content: 'notification b',
        type: 'info',
      },
    ]);
    const user = userEvent.setup();
    render(<Notifications />);

    // it is required to wait because of the state update
    await waitFor(async () => {
      await user.click(
        screen.getByRole('button', { name: 'View all notifications' }),
      );
    });

    const notificationsList = screen.getByRole('list', {
      name: 'Notifications',
    });
    const notifications = within(notificationsList).queryAllByRole('listitem');

    expect(notifications.length).toBe(2);
    expect(screen.getByText('notification a')).toBeVisible();
    expect(screen.getByText('notification b')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Notifications' }),
    ).toBeVisible();
  });

  it('should render the counts of each notification type', () => {
    const notificationCounts = [
      { type: 'info', loading: false, count: 1 },
      { type: 'success', loading: false, count: 2 },
      { type: 'error', loading: false, count: 3 },
      { type: 'warning', loading: false, count: 4 },
      { type: 'info', loading: true, count: 5 },
    ] as const; // to convert to literal type

    const notifications = notificationCounts.reduce<NotificationViewModel[]>(
      (acc, { count, type, loading }) => {
        return [
          ...acc,
          ...Array.from({ length: count }, (_, i) => ({
            id: `${i + 1}`,
            content: `${type} notification ${i + 1}`,
            type,
            loading,
          })),
        ];
      },
      [],
    );

    useNotificationsMock.mockReturnValueOnce(notifications);
    render(<Notifications />);

    const status = screen.getByRole('status');

    expect(within(status).getByText(notificationCounts[0].count)).toBeVisible(); // info
    expect(within(status).getByText(notificationCounts[1].count)).toBeVisible(); // success
    expect(within(status).getByText(notificationCounts[2].count)).toBeVisible(); // error
    expect(within(status).getByText(notificationCounts[3].count)).toBeVisible(); // warning
    expect(within(status).getByText(notificationCounts[4].count)).toBeVisible(); // info loading
  });
});
