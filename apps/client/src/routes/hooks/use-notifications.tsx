import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { FlashbarProps } from '@cloudscape-design/components';

export type Notifications = FlashbarProps['items'];
export type SetNotifications = Dispatch<SetStateAction<Notifications>>;

export const NotificationsContext = createContext<Notifications>([]);
export const NotificationsDispatchContext = createContext<SetNotifications>(
  () => undefined,
);

export function useNotifications() {
  const notifications = useContext(NotificationsContext);
  const setNotifications = useContext(NotificationsDispatchContext);

  return { notifications, setNotifications };
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
