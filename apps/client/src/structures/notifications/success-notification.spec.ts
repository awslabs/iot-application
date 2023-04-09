import { Notification } from './notification';
import { SuccessNotification } from './success-notification';

describe('SuccessNotification', () => {
  it('should create a success notification', () => {
    const notification = new SuccessNotification('test');

    expect(notification).toBeInstanceOf(Notification);
    expect(notification.type).toBe('success');
    expect(notification.content).toBe('test');
  });
});
