import { vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { CloudWatchLogger, LOG_LEVEL } from './cloud-watch-logger';
import 'aws-sdk-client-mock-jest';
import { PUT_LOG_EVENTS_THROTTLE } from './cloud-watch-logger';

describe('CloudWatchLogger', () => {
  const cloudWatchClientMock = mockClient(CloudWatchLogsClient);
  const logGroupName = 'testLogGroupName';
  const logStreamName = 'testLogStreamName';
  const mockAuthService = {
    getAwsCredentials: vi.fn().mockResolvedValue({
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    }),
    awsRegion: 'us-west-2',
    getToken: vi.fn(),
    onSignedIn: vi.fn(),
    onSignedOut: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    cloudWatchClientMock.reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('initializes and sends prerecorded logs to CloudWatch', async () => {
    cloudWatchClientMock.on(CreateLogStreamCommand).resolvesOnce({});
    cloudWatchClientMock.on(PutLogEventsCommand).resolves({});

    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);

    const current = new Date().getTime();
    cloudWatchLogger.log({
      message: 'message0',
    });

    await cloudWatchLogger.init(logGroupName, logStreamName);

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      CreateLogStreamCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      CreateLogStreamCommand,
      {
        logGroupName,
        logStreamName,
      },
    );

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // With no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.log,
              message: 'message0',
            }),
            timestamp: current,
          },
        ],
      },
    );
  });

  test('does not send logs before initialization', () => {
    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);
    cloudWatchLogger.log({
      message: 'message0',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).not.toHaveReceivedCommand(PutLogEventsCommand);
  });

  test('logs to CloudWatch', async () => {
    cloudWatchClientMock.on(CreateLogStreamCommand).resolves({});
    cloudWatchClientMock.on(PutLogEventsCommand).resolves({});

    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);
    await cloudWatchLogger.init(logGroupName, logStreamName);

    const current = new Date().getTime();

    // With no context nor timestamp
    cloudWatchLogger.log({
      message: 'message0',
    });

    // With provided timestamp
    const timestamp = new Date(Date.now() + 1000);
    cloudWatchLogger.log({
      message: 'message1',
      timestamp,
    });

    // With 1 context
    cloudWatchLogger.log({
      contexts: {
        context1: 'value1',
      },
      message: 'message2',
    });

    // With 2 context
    cloudWatchLogger.log({
      contexts: {
        context1: 'value1',
        context2: 'value2',
      },
      message: 'message3',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // Log with no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.log,
              message: 'message0',
            }),
            timestamp: current,
          },
          // Warn with 1 context
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
              },
              level: LOG_LEVEL.log,
              message: 'message2',
            }),
            timestamp: current,
          },
          // Error with 2 contexts
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
                context2: 'value2',
              },
              level: LOG_LEVEL.log,
              message: 'message3',
            }),
            timestamp: current,
          },
          // Log with provided timestamp (sorted to the end)
          {
            message: JSON.stringify({
              level: LOG_LEVEL.log,
              message: 'message1',
            }),
            timestamp: timestamp.getTime(),
          },
        ],
      },
    );
  });

  test('sends error logs to CloudWatch', async () => {
    cloudWatchClientMock.on(CreateLogStreamCommand).resolves({});
    cloudWatchClientMock.on(PutLogEventsCommand).resolves({});

    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);
    await cloudWatchLogger.init(logGroupName, logStreamName);

    const current = new Date().getTime();

    // With no context nor timestamp
    cloudWatchLogger.error({
      message: 'message0',
    });

    // With provided timestamp
    const timestamp = new Date(Date.now() + 1000);
    cloudWatchLogger.error({
      message: 'message1',
      timestamp,
    });

    // With 1 context
    cloudWatchLogger.error({
      contexts: {
        context1: 'value1',
      },
      message: 'message2',
    });

    // With 2 context
    cloudWatchLogger.error({
      contexts: {
        context1: 'value1',
        context2: 'value2',
      },
      message: 'message3',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // Log with no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.error,
              message: 'message0',
            }),
            timestamp: current,
          },
          // Warn with 1 context
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
              },
              level: LOG_LEVEL.error,
              message: 'message2',
            }),
            timestamp: current,
          },
          // Error with 2 contexts
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
                context2: 'value2',
              },
              level: LOG_LEVEL.error,
              message: 'message3',
            }),
            timestamp: current,
          },
          // Log with provided timestamp (sorted to the end)
          {
            message: JSON.stringify({
              level: LOG_LEVEL.error,
              message: 'message1',
            }),
            timestamp: timestamp.getTime(),
          },
        ],
      },
    );
  });

  test('sends warn logs to CloudWatch', async () => {
    cloudWatchClientMock.on(CreateLogStreamCommand).resolves({});
    cloudWatchClientMock.on(PutLogEventsCommand).resolves({});

    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);
    await cloudWatchLogger.init(logGroupName, logStreamName);

    const current = new Date().getTime();

    // With no context nor timestamp
    cloudWatchLogger.warn({
      message: 'message0',
    });

    // With provided timestamp
    const timestamp = new Date(Date.now() + 1000);
    cloudWatchLogger.warn({
      message: 'message1',
      timestamp,
    });

    // With 1 context
    cloudWatchLogger.warn({
      contexts: {
        context1: 'value1',
      },
      message: 'message2',
    });

    // With 2 context
    cloudWatchLogger.warn({
      contexts: {
        context1: 'value1',
        context2: 'value2',
      },
      message: 'message3',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // Log with no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.warn,
              message: 'message0',
            }),
            timestamp: current,
          },
          // Warn with 1 context
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
              },
              level: LOG_LEVEL.warn,
              message: 'message2',
            }),
            timestamp: current,
          },
          // Error with 2 contexts
          {
            message: JSON.stringify({
              contexts: {
                context1: 'value1',
                context2: 'value2',
              },
              level: LOG_LEVEL.warn,
              message: 'message3',
            }),
            timestamp: current,
          },
          // Log with provided timestamp (sorted to the end)
          {
            message: JSON.stringify({
              level: LOG_LEVEL.warn,
              message: 'message1',
            }),
            timestamp: timestamp.getTime(),
          },
        ],
      },
    );
  });

  test('logs to CloudWatch in batches with throttling', async () => {
    cloudWatchClientMock.on(PutLogEventsCommand).resolves({});

    const cloudWatchLogger = new CloudWatchLogger(mockAuthService);
    await cloudWatchLogger.init(logGroupName, logStreamName);

    const timestamp0 = new Date().getTime();

    cloudWatchLogger.log({
      message: 'message0',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // With no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.log,
              message: 'message0',
            }),
            timestamp: timestamp0,
          },
        ],
      },
    );

    const timestamp1 = new Date().getTime();
    cloudWatchLogger.log({
      message: 'message1',
    });

    vi.advanceTimersByTime(PUT_LOG_EVENTS_THROTTLE);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutLogEventsCommand,
      2,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutLogEventsCommand,
      {
        logGroupName,
        logStreamName,
        logEvents: [
          // With no context nor timestamp
          {
            message: JSON.stringify({
              level: LOG_LEVEL.log,
              message: 'message1',
            }),
            timestamp: timestamp1,
          },
        ],
      },
    );
  });
});
