import useLocalStorage from 'react-use/lib/useLocalStorage';
import type { Viewport } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT: Viewport = { duration: '5 minutes' };
export const useViewport = (dashboardId: string) => {
  return useLocalStorage<Viewport>(
    `dashboard-${dashboardId}-viewport`,
    DEFAULT_VIEWPORT,
  );
};
