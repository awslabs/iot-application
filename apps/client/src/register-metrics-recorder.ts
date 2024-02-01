import { registerPlugin } from '@iot-app-kit/core';
import { cloudWatchMetricsRecorder } from './metrics/cloud-watch-metrics-recorder';

const MetricModes = {
  Local: 'local',
  Cloud: 'cloud',
};

export function registerMetricsRecorder(metricsMode: string) {
  if (metricsMode === MetricModes.Local) {
    registerPlugin('metricsRecorder', {
      provider: () => ({
        /* eslint-disable no-console */
        record: (...args) => console.log('record metric:', ...args),
      }),
    });
  } else {
    registerPlugin('metricsRecorder', {
      provider: () => cloudWatchMetricsRecorder,
    });
  }
}
