import { emitNotificationAtom } from '~/store/notifications';
import { useSetAtom } from 'jotai';

/** Use write-only notification global store. */
export function useEmitNotification() {
  return useSetAtom(emitNotificationAtom);
}
