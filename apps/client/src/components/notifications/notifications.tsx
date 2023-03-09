import Flashbar, {
  FlashbarProps,
} from '@cloudscape-design/components/flashbar';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface Props {
  notifications: FlashbarProps['items'];
}

export type Notifications = FlashbarProps['items'];
export type SetNotifications = Dispatch<SetStateAction<Notifications>>;

export const NotificationsContext = createContext<Notifications>([]);
export const NotificationsDispatchContext = createContext<SetNotifications>(
  () => undefined,
);

export function useNotifications() {
  const notifications = useContext(NotificationsContext);
  const setNotifications = useContext(NotificationsDispatchContext);

  return {
    Notifications: () => <Notifications notifications={notifications} />,
    notifications,
    setNotifications,
  };
}

export function NotificationsProvider({ children }: React.PropsWithChildren) {
  const [notifications, setNotifications] = useState<Notifications>([]);

  return (
    <NotificationsContext.Provider value={notifications}>
      <NotificationsDispatchContext.Provider value={setNotifications}>
        {children}
      </NotificationsDispatchContext.Provider>
    </NotificationsContext.Provider>
  );
}

export function Notifications({ notifications }: Props) {
  return <Flashbar items={notifications} stackItems={true} />;
}
