import { atom } from 'jotai';
import { nanoid } from 'nanoid';

import { withoutIdentifiable } from '~/helpers/lists';
import { intl } from '~/services';
import type { NotificationViewModel } from '~/types';

/**
 * Notifications store
 *
 * Do not export.
 */
const notificationsBaseAtom = atom<NotificationViewModel[]>([]);

/**
 * Readonly notifications
 *
 * Use for all notification store queries.
 */
export const notificationsAtom = atom((get) => get(notificationsBaseAtom));

/** Remove notification from store */
const dismissNotificationAtom = atom(null, (_get, set, id: string) => {
  set(notificationsBaseAtom, withoutIdentifiable({ id }));
});

/** Remove all notifcations from store */
export const dismissAllNotificationsAtom = atom(null, (_get, set) => {
  set(notificationsBaseAtom, []);
});

/** Add notification to store */
export const emitNotificationAtom = atom(
  null,
  (
    get,
    set,
    notification: Omit<
      NotificationViewModel,
      'id' | 'onDismiss' | 'dismissible'
    >,
  ) => {
    const notificationId = nanoid();

    // For Migration only display one status notification at a time
    const existingNotifications = get(notificationsAtom);
    const foundDuplicate = existingNotifications.find(
      (notif) => notif.content === notification.content,
    );
    const preventNotification =
      foundDuplicate &&
      typeof notification.content === 'string' &&
      notification.content.toLowerCase().includes('migration');

    if (!preventNotification) {
      set(notificationsBaseAtom, () => [
        {
          ...notification,
          id: notificationId,
          dismissible: true,
          onDismiss: () => {
            set(dismissNotificationAtom, notificationId);
          },
          dismissLabel: intl.formatMessage({
            defaultMessage: 'Dismiss notification',
            description: 'dismiss notification aria label',
          }),
          ariaRole: 'status',
        },
        ...get(notificationsAtom),
      ]);
    }
  },
);
