import { Notification } from './notification';
import { LoadingNotification } from './loading-notification';

describe('LoadingNotification', () => {
  it('should create a loading notification', () => {
    const notification = new LoadingNotification('test');

    expect(notification).toBeInstanceOf(Notification);
    expect(notification.type).toBe('success');
    expect(notification.loading).toBe(true);
    expect(notification.content).toBe('test');
  });
});
