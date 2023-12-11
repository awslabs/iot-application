import { registerPlugin } from '@iot-app-kit/core';
import { cloudWatchLogger } from './logging/cloud-watch-logger';

export function registerLogger() {
  registerPlugin('logger', {
    provider: () => cloudWatchLogger,
  });
}
