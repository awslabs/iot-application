import { Notification } from './notification';
import { InfoNotification } from './info-notification';

describe('InfoNotification', () => {
  it('should create an info notification', () => {
    const notification = new InfoNotification('test');

    expect(notification).toBeInstanceOf(Notification);
    expect(notification.type).toBe('info');
    expect(notification.content).toBe('test');
  });
});
