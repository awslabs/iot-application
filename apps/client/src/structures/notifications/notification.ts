import { NotificationViewModel } from '~/types/notification-view-model';

export class Notification {
  constructor(
    public readonly type: NotificationViewModel['type'],
    public readonly content: NotificationViewModel['content'],
  ) {}
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it.each(['info', 'success', 'warning', 'error'] as const)(
    'should create a notification with type %s',
    (type) => {
      const notification = new Notification(type, 'test');

      expect(notification.type).toBe(type);
      expect(notification.content).toBe('test');
    },
  );
}
