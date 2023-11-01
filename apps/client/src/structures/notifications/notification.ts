import { NotificationViewModel } from '~/types/notification-view-model';

export class Notification {
  constructor(
    public readonly type: NotificationViewModel['type'],
    public readonly content: NotificationViewModel['content'],
    public readonly loading?: NotificationViewModel['loading'],
  ) {}
}
