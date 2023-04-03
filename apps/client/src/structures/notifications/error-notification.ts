import { Notification } from './notification';

export class ErrorNotification extends Notification {
  constructor(content: string) {
    super('error', content);
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should create an error notification', () => {
    const notification = new ErrorNotification('test');

    expect(notification.type).toBe('error');
    expect(notification.content).toBe('test');
  });
}
