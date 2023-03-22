import { atom } from 'jotai';
import { nanoid } from 'nanoid';

import { withoutIdentifiable } from '~/helpers/lists';
import { intl } from '~/services';
import type { Notification } from '~/types';

/**
 * Notifications store
 *
 * Do not export.
 */
const notificationsBaseAtom = atom<Notification[]>([]);

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

/** Add notification to store */
export const sendNotificationAtom = atom(
  null,
  (
    get,
    set,
    notification: Omit<Notification, 'id' | 'onDismiss' | 'dismissible'>,
  ) => {
    const notificationId = nanoid();

    set(notificationsBaseAtom, () => [
      ...get(notificationsAtom),
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
      },
    ]);
  },
);
