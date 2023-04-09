import { Notification } from './notification';

export class ErrorNotification extends Notification {
  constructor(content: string) {
    super('error', content);
  }
}
