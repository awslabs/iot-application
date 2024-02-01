import { registerPlugin } from '@iot-app-kit/core';
import { cloudWatchLogger } from './logging/cloud-watch-logger';

const LogModes = {
  Local: 'local',
  Cloud: 'cloud',
};

export function registerLogger(logMode: string) {
  if (logMode === LogModes.Local) {
    registerPlugin('logger', {
      provider: () => ({
        /* eslint-disable no-console */
        log: (...args) => console.log('logging:', ...args),
        error: (...args) => console.error('logging:', ...args),
        warn: (...args) => console.warn('logging:', ...args),
      }),
    });
  } else {
    registerPlugin('logger', {
      provider: () => cloudWatchLogger,
    });
  }
}
