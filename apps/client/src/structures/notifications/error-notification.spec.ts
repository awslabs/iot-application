import { ErrorNotification } from './error-notification';
import { Notification } from './notification';

describe('ErrorNotification', () => {
  it('should create an error notification', () => {
    const notification = new ErrorNotification('test');

    expect(notification).toBeInstanceOf(Notification);
    expect(notification.type).toBe('error');
    expect(notification.content).toBe('test');
  });
});
