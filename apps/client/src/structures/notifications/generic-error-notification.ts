import { ErrorNotification } from './error-notification';

export class GenericErrorNotification extends ErrorNotification {
  constructor(error: Error) {
    super(error.message);
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should create a generic error notification', () => {
    const notification = new GenericErrorNotification(new Error('test'));

    expect(notification.type).toBe('error');
    expect(notification.content).toBe('test');
  });
}
