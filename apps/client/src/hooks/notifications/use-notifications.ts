import { notificationsAtom } from '~/store/notifications';
import { useAtomValue } from 'jotai';

export function useNotifications() {
  return useAtomValue(notificationsAtom);
}
