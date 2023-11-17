import { vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import { CloudWatchMetricsRecorder } from './cloud-watch-metrics-recorder';
import 'aws-sdk-client-mock-jest';

describe('CloudWatchMetricsRecorder', () => {
  const cloudWatchClientMock = mockClient(CloudWatchClient);
  const mockAuthService = {
    getAwsCredentials: vi.fn().mockResolvedValue({
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    }),
    awsRegion: 'us-west-2',
    getToken: vi.fn(),
  };
  const metricNamespace = 'testMetricNamespace';

  beforeEach(() => {
    vi.useFakeTimers();
    cloudWatchClientMock.reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('records metrics and sends to CloudWatch', () => {
    cloudWatchClientMock.on(PutMetricDataCommand).resolves({});

    const cloudWatchMetricsRecorder = new CloudWatchMetricsRecorder(
      mockAuthService,
    );
    cloudWatchMetricsRecorder.setMetricNamespace(metricNamespace);

    const current = new Date();

    // With no context nor timestamp
    cloudWatchMetricsRecorder.record({
      metricName: 'metric0',
      metricValue: 0,
    });

    // With provided timestamp
    const timestamp = new Date(Date.now() + 1000);
    cloudWatchMetricsRecorder.record({
      metricName: 'metric1',
      metricValue: 1111,
      timestamp,
    });

    // With 1 context
    cloudWatchMetricsRecorder.record({
      contexts: {
        context1: 'value1',
      },
      metricName: 'metric2',
      metricValue: 2222,
    });

    // With 2 context
    cloudWatchMetricsRecorder.record({
      contexts: {
        context1: 'value1',
        context2: 'value2',
      },
      metricName: 'metric3',
      metricValue: 3333,
    });

    // PUT_METRICS_THROTTLE
    vi.advanceTimersByTime(3000);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutMetricDataCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutMetricDataCommand,
      {
        Namespace: metricNamespace,
        MetricData: [
          // With no context nor timestamp
          {
            MetricName: 'metric0',
            Timestamp: current,
            Value: 0,
          },
          // With provided timestamp
          {
            MetricName: 'metric1',
            Timestamp: timestamp,
            Value: 1111,
          },
          // With 1 context
          {
            Dimensions: [
              {
                Name: 'context1',
                Value: 'value1',
              },
            ],
            MetricName: 'metric2',
            Timestamp: current,
            Value: 2222,
          },
          // With 2 contexts
          {
            Dimensions: [
              {
                Name: 'context1',
                Value: 'value1',
              },
              {
                Name: 'context2',
                Value: 'value2',
              },
            ],
            MetricName: 'metric3',
            Timestamp: current,
            Value: 3333,
          },
        ],
      },
    );
  });

  test('records metrics and sends to CloudWatch in batches with throttling', () => {
    cloudWatchClientMock.on(PutMetricDataCommand).resolves({});

    const cloudWatchMetricsRecorder = new CloudWatchMetricsRecorder(
      mockAuthService,
    );
    cloudWatchMetricsRecorder.setMetricNamespace(metricNamespace);

    const timestamp0 = new Date();
    cloudWatchMetricsRecorder.record({
      metricName: 'metric0',
      metricValue: 0,
    });

    // PUT_METRICS_THROTTLE
    vi.advanceTimersByTime(3000);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutMetricDataCommand,
      1,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutMetricDataCommand,
      {
        Namespace: metricNamespace,
        MetricData: [
          {
            MetricName: 'metric0',
            Timestamp: timestamp0,
            Value: 0,
          },
        ],
      },
    );

    const timestamp1 = new Date();
    cloudWatchMetricsRecorder.record({
      metricName: 'metric1',
      metricValue: 1,
    });

    // PUT_METRICS_THROTTLE
    vi.advanceTimersByTime(3000);

    expect(cloudWatchClientMock).toHaveReceivedCommandTimes(
      PutMetricDataCommand,
      2,
    );
    expect(cloudWatchClientMock).toHaveReceivedCommandWith(
      PutMetricDataCommand,
      {
        Namespace: metricNamespace,
        MetricData: [
          {
            MetricName: 'metric1',
            Value: 1,
            Timestamp: timestamp1,
          },
        ],
      },
    );
  });
});
