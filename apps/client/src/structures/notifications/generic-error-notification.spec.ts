import { ErrorNotification } from './error-notification';
import { GenericErrorNotification } from './generic-error-notification';
import { Notification } from './notification';

describe('GenericErrorNotification', () => {
  it('should create a generic error notification', () => {
    const notification = new GenericErrorNotification(new Error('test'));

    expect(notification).toBeInstanceOf(ErrorNotification);
    expect(notification).toBeInstanceOf(Notification);
    expect(notification.type).toBe('error');
    expect(notification.content).toBe('test');
  });
});
