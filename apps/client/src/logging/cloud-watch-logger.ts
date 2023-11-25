import { type Log, type Logger } from '@iot-app-kit/core';
import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import throttle from 'lodash/throttle';
import { type AuthService } from '~/auth/auth-service.interface';
import { authService } from '~/auth/auth-service';

// at most one putLogEvents() call every X ms
export const PUT_LOG_EVENTS_THROTTLE = 3000;

export enum LOG_LEVEL {
  log = 30,
  warn = 40,
  error = 50,
}

interface LogEvent {
  message: string;
  timestamp: number;
}

class CloudWatchLogsQueue {
  private readonly queue = new Set<LogEvent>();

  enqueue(log: Log, level: LOG_LEVEL) {
    const logEvent = CloudWatchLogsQueue.parseLogEvent(log, level);
    this.queue.add(logEvent);
  }

  getLogEvents() {
    return Array.from(this.queue).sort((a, b) =>
      CloudWatchLogsQueue.compareLogEventsTimestamps(a, b),
    );
  }

  clear() {
    this.queue.clear();
  }

  private static parseLogEvent(
    { contexts, message, timestamp }: Log,
    level: LOG_LEVEL,
  ) {
    const eventTimestamp = (timestamp ?? new Date()).getTime();
    const eventMessage = JSON.stringify({ contexts, level, message });

    const logEvent = {
      message: eventMessage,
      timestamp: eventTimestamp,
    };

    return logEvent;
  }

  private static compareLogEventsTimestamps(
    { timestamp: timestampA }: LogEvent,
    { timestamp: timestampB }: LogEvent,
  ) {
    return timestampA - timestampB;
  }
}

/**
 * This Logger stores logs in AWS CloudWatch Logs.
 */
export class CloudWatchLogger implements Logger {
  private readonly queue = new CloudWatchLogsQueue();
  private readonly cloudWatchClient: CloudWatchLogsClient;
  private logResourcesNames = {
    logGroupName: '',
    logStreamName: '',
  };
  // Whether system is ready to send logs to CloudWatch
  private isInitialized = false;

  constructor(authService: AuthService) {
    this.cloudWatchClient = new CloudWatchLogsClient({
      credentials: () => authService.getAwsCredentials(),
      region: authService.awsRegion,
    });
  }

  async init(logGroupName: string, logStreamName: string) {
    const command = new CreateLogStreamCommand({
      logGroupName,
      logStreamName,
    });

    try {
      await this.cloudWatchClient.send(command);
    } catch (e) {
      console.error('Error during log stream creation:', e);

      throw e;
    }

    this.setLogNames(logGroupName, logStreamName);
    this.isInitialized = true;

    // Flush out recorded logs
    void this.putLogEventsThrottled();
  }

  log(log: Log) {
    this.queue.enqueue(log, LOG_LEVEL.log);
    void this.putLogEventsThrottled();
  }

  error(log: Log) {
    this.queue.enqueue(log, LOG_LEVEL.error);
    void this.putLogEventsThrottled();
  }

  warn(log: Log) {
    this.queue.enqueue(log, LOG_LEVEL.warn);
    void this.putLogEventsThrottled();
  }

  private setLogNames(logGroupName: string, logStreamName: string) {
    this.logResourcesNames.logGroupName = logGroupName;
    this.logResourcesNames.logStreamName = logStreamName;
  }

  private putLogEventsThrottled = throttle(
    () => this.putLogEvents(),
    PUT_LOG_EVENTS_THROTTLE,
    {
      leading: false,
      trailing: true,
    },
  );

  private async putLogEvents() {
    if (!this.isInitialized) {
      // NOOP until system is initialized
      return;
    }

    const logEvents = this.queue.getLogEvents();

    if (logEvents.length === 0) {
      return;
    }

    const input = {
      ...this.logResourcesNames,
      logEvents,
    };
    const command = new PutLogEventsCommand(input);

    this.queue.clear();

    try {
      await this.cloudWatchClient.send(command);
    } catch (e) {
      console.error('Error during logger sending logs:', e);
    }
  }
}

export const cloudWatchLogger = new CloudWatchLogger(authService);
