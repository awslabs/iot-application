import { type MetricsRecorder } from '@iot-app-kit/core';
import { MINUTE_IN_MS } from '../constants/time';
import { cloudWatchMetricsRecorder } from '../metrics/cloud-watch-metrics-recorder';

export const SESSION_DURATION_REPORT_FREQUENCY = MINUTE_IN_MS; // how often to report session duration in milliseconds

/**
 * This class records session duration as metric.
 * Session duration is recorded in minutes.
 */
export class SessionDurationRecorder {
  private currentInterval?: NodeJS.Timeout;

  constructor(private metricsRecorder: MetricsRecorder) {}

  start(sessionId: string) {
    if (this.currentInterval !== undefined) {
      throw new Error(
        'Existing session in progress, only 1 ongoing session can be recorded.',
      );
    }

    let duration = 0;

    this.currentInterval = setInterval(() => {
      const lapse = SESSION_DURATION_REPORT_FREQUENCY / MINUTE_IN_MS;
      duration += lapse;

      this.recordCurrentSessionDuration(duration, sessionId);
      this.recordSessionDurationPing(lapse);
    }, SESSION_DURATION_REPORT_FREQUENCY);
  }

  stop() {
    if (this.currentInterval === undefined) {
      throw new Error(
        'No existing session in progress. Please start before stopping a session.',
      );
    }

    clearInterval(this.currentInterval);
    this.currentInterval = undefined;
  }

  private recordCurrentSessionDuration(duration: number, sessionId: string) {
    this.metricsRecorder.record({
      contexts: {
        sessionId,
      },
      metricName: 'CurrentSessionDuration',
      metricValue: duration,
    });
  }

  private recordSessionDurationPing(duration: number) {
    this.metricsRecorder.record({
      metricName: 'SessionDurationPing',
      metricValue: duration,
    });
  }
}

export const sessionDurationRecorder = new SessionDurationRecorder(
  cloudWatchMetricsRecorder,
);
