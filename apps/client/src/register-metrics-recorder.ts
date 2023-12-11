import { registerPlugin } from '@iot-app-kit/core';
import { cloudWatchMetricsRecorder } from './metrics/cloud-watch-metrics-recorder';

export function registerMetricsRecorder() {
  registerPlugin('metricsRecorder', {
    provider: () => cloudWatchMetricsRecorder,
  });
}
