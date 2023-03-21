import Flashbar from '@cloudscape-design/components/flashbar';
import { useNotifications } from '~/hooks/notifications/use-notifications';

export function Notifications() {
  const notifications = useNotifications();

  return <Flashbar items={notifications} stackItems={true} />;
}
