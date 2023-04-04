import { vi } from 'vitest';
import { render, screen, within } from '~/helpers/tests/testing-library';

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

    expect(notifications).toHaveLength(0);
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

    expect(notifications).toHaveLength(1);
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

    expect(notifications).toHaveLength(1);
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

    await user.click(
      screen.getByRole('button', { name: 'View all notifications' }),
    );

    const notificationsList = screen.getByRole('list', {
      name: 'Notifications',
    });
    const notifications = within(notificationsList).queryAllByRole('listitem');

    expect(notifications).toHaveLength(2);
    expect(screen.getByRole('status')).toBeVisible();
    expect(screen.getByText('notification a')).toBeVisible();
    expect(screen.getByText('notification b')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Notifications' }),
    ).toBeVisible();
  });

  it('should render the counts of each notification type', () => {
    useNotificationsMock.mockReturnValueOnce([
      {
        id: '1',
        content: 'info notification 1',
        type: 'info',
      },
      {
        id: '2',
        content: 'success notification 1',
        type: 'success',
      },
      {
        id: '3',
        content: 'success notification 2',
        type: 'success',
      },
      {
        id: '4',
        content: 'error notification 1',
        type: 'error',
      },
      {
        id: '5',
        content: 'error notification 2',
        type: 'error',
      },
      {
        id: '6',
        content: 'error notification 3',
        type: 'error',
      },
      {
        id: '7',
        content: 'warning notification 1',
        type: 'warning',
      },
      {
        id: '8',
        content: 'warning notification 2',
        type: 'warning',
      },
      {
        id: '9',
        content: 'inprogress notification 1',
        type: 'info',
        loading: true,
      },
    ]);
    render(<Notifications />);

    const status = screen.getByRole('status');

    expect(
      within(status).getByRole('img', { name: 'Info' }).nextSibling,
    ).toHaveTextContent('1');
    expect(
      within(status).getByRole('img', { name: 'Success' }).nextSibling,
    ).toHaveTextContent('2');
    expect(
      within(status).getByRole('img', { name: 'Error' }).nextSibling,
    ).toHaveTextContent('3');
    expect(
      within(status).getByRole('img', { name: 'Warning' }).nextSibling,
    ).toHaveTextContent('2');
    expect(
      within(status).getByRole('img', { name: 'In progress' }).nextSibling,
    ).toHaveTextContent('1');
  });
});
