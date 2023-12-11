import { v4 as uuid } from 'uuid';
import { utcDateString } from './helpers/dates';
import { cloudWatchMetricsRecorder } from './metrics/cloud-watch-metrics-recorder';
import { cloudWatchLogger } from './logging/cloud-watch-logger';

/**
 * This function initializes the services that depends on authentication to work
 * @param applicationName the name of this application
 */
export async function initializeAuthDependents(applicationName: string) {
  const logStreamName = `${utcDateString(new Date())}-${uuid()}`;
  cloudWatchMetricsRecorder.init(applicationName);
  try {
    await cloudWatchLogger.init(applicationName, logStreamName);
  } catch (e) {
    // NOOP; application should proceed;
    console.error(
      'Error during CloudWatch logger initialization, no logs are sent to CloudWatch',
    );
  }
}
