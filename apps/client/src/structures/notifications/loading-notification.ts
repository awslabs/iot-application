import { Notification } from './notification';

export class LoadingNotification extends Notification {
  constructor(content: string) {
    super('success', content, true);
  }
}
