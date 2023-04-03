import { Notification } from './notification';

export class SuccessNotification extends Notification {
  constructor(content: string) {
    super('success', content);
  }
}
