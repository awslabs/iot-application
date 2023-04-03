import { notificationsAtom } from '~/store/notifications';
import { useAtomValue } from 'jotai';

/** Use readonly notification global store. */
export function useNotifications() {
  return useAtomValue(notificationsAtom);
}
