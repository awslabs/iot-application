import { Notification } from './notification';

describe('Notification', () => {
  it.each(['info', 'success', 'warning', 'error'] as const)(
    'should create a notification with type %s',
    (type) => {
      const notification = new Notification(type, 'test');

      expect(notification.type).toBe(type);
      expect(notification.content).toBe('test');
    },
  );
});
