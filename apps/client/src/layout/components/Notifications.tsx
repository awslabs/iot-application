import { atom, useAtomValue, useSetAtom } from 'jotai';
import Flashbar, {
  FlashbarProps,
} from '@cloudscape-design/components/flashbar';
import invariant from 'tiny-invariant';
import type { SetRequired } from 'type-fest';

type Notification = SetRequired<FlashbarProps['items'][number], 'id'>;

const notificationsBaseAtom = atom<Notification[]>([]);

export const notificationsAtom = atom<Notification[]>((get) =>
  get(notificationsBaseAtom),
);

const dismissNotificationAtom = atom(null, (get, set, id: string) => {
  const notifications = get(notificationsBaseAtom);
  const notification = notifications.find((n) => n.id === id);

  invariant(notification, 'Expected a matching notification.');

  set(notificationsBaseAtom, (prev) =>
    prev.filter((n) => n.id === notification.id),
  );
});

const sendNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'onDismiss' | 'dismissible'>) => {
    set(notificationsBaseAtom, () => [
      ...get(notificationsAtom),
      {
        ...notification,
        dismissible: true,
        onDismiss: () => {
          set(dismissNotificationAtom, notification.id);
        },
      },
    ]);
  },
);

function useNotifications() {
  return useAtomValue(notificationsAtom);
}

export function useSendNotification() {
  return useSetAtom(sendNotificationAtom);
}

export function Notifications() {
  const notifications = useNotifications();

  return <Flashbar items={notifications} stackItems={true} />;
}
