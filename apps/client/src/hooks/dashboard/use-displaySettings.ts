import { useLocalStorage } from 'react-use';
import { DashboardDisplaySettings } from '@iot-app-kit/dashboard';

const DEFAULT_DISPLAY_SETTINGS: DashboardDisplaySettings = {
  numRows: 1000,
  numColumns: 200,
  cellSize: 20,
};
export const useDisplaySettings = (dashboardId: string) => {
  return useLocalStorage<DashboardDisplaySettings>(
    `dashboard-${dashboardId}-display-settings`,
    DEFAULT_DISPLAY_SETTINGS,
  );
};
