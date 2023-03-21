import { sendNotificationAtom } from '~/store/notifications';
import { useSetAtom } from 'jotai';

export function useSendNotification() {
  return useSetAtom(sendNotificationAtom);
}
