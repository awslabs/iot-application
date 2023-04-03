import { useSetAtom } from 'jotai';
import { dismissAllNotificationsAtom } from '~/store/notifications';

/** Use to dismiss all notifications from global store. */
export function useDismissAllNotifications() {
  return useSetAtom(dismissAllNotificationsAtom);
}
