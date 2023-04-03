import { Notification } from './notification';

export class SuccessNotification extends Notification {
  constructor(content: string) {
    super('success', content);
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should create a success notification', () => {
    const notification = new SuccessNotification('test');

    expect(notification.type).toBe('success');
    expect(notification.content).toBe('test');
  });
}
