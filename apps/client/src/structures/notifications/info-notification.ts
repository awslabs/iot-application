import { Notification } from './notification';

export class InfoNotification extends Notification {
  constructor(content: string) {
    super('info', content);
  }
}
