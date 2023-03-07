import { useState } from 'react';

import type { FlashbarProps } from '@cloudscape-design/components';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<FlashbarProps['items']>(
    [],
  );

  function add(newNotification: Omit<FlashbarProps['items'][0], 'onDismiss'>) {
    setNotifications((notifications) => [
      ...notifications,
      {
        ...newNotification,
        onDismiss: () => {
          setNotifications((notifications) =>
            notifications.filter(
              (notification) => notification.id !== newNotification.id,
            ),
          );
        },
      },
    ]);
  }

  return { notifications, add };
};
