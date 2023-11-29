import { type Metric, type MetricsRecorder } from '@iot-app-kit/core';
import {
  CloudWatchClient,
  type MetricDatum,
  PutMetricDataCommand,
  type PutMetricDataCommandInput,
} from '@aws-sdk/client-cloudwatch';
import throttle from 'lodash/throttle';
import { type AuthService } from '~/auth/auth-service.interface';
import { authService } from '~/auth/auth-service';

// at most one putMetrics() call every X ms
export const PUT_METRICS_THROTTLE = 3000;

class CloudWatchMetricsQueue {
  private readonly queue = new Set<MetricDatum>();

  enqueue(metric: Metric) {
    const datum = CloudWatchMetricsQueue.parseMetric(metric);
    this.queue.add(datum);
  }

  getMetricData() {
    return Array.from(this.queue);
  }

  clear() {
    this.queue.clear();
  }

  private static parseMetric({
    contexts,
    metricName: MetricName,
    metricValue: Value,
    timestamp,
  }: Metric) {
    const Timestamp = timestamp ?? new Date();
    const Dimensions = CloudWatchMetricsQueue.parseDimensions(contexts);

    const datum = {
      Dimensions,
      MetricName,
      Timestamp,
      Value,
    };

    return datum;
  }

  private static parseDimensions(contexts: Metric['contexts']) {
    if (contexts == null) {
      return;
    }

    const dimensions = Object.entries(contexts).map(([Name, Value]) => ({
      Name,
      Value,
    }));

    return dimensions;
  }
}

/**
 * This MetricsRecorder stores metric data in AWS CloudWatch.
 */
export class CloudWatchMetricsRecorder implements MetricsRecorder {
  private readonly queue = new CloudWatchMetricsQueue();
  private readonly cloudWatchClient: CloudWatchClient;
  private metricNamespace = '';
  // Whether system is ready to send metrics to CloudWatch
  private isInitialized = false;

  constructor(authService: AuthService) {
    this.cloudWatchClient = new CloudWatchClient({
      credentials: () => authService.getAwsCredentials(),
      region: authService.awsRegion,
    });
  }

  init(metricNamespace: string) {
    if (this.isInitialized) {
      return;
    }

    this.metricNamespace = metricNamespace;
    this.isInitialized = true;

    // Flush out recorded logs
    void this.putMetricsThrottled();
  }

  record(metric: Parameters<MetricsRecorder['record']>[0]) {
    this.queue.enqueue(metric);
    void this.putMetricsThrottled();
    // eslint-disable-next-line no-console
    console.log(metric);
  }

  private putMetricsThrottled = throttle(
    () => this.putMetrics(),
    PUT_METRICS_THROTTLE,
    {
      leading: false,
      trailing: true,
    },
  );

  private async putMetrics() {
    if (!this.isInitialized) {
      // NOOP until system is initialized
      return;
    }

    const metricData = this.queue.getMetricData();

    if (metricData.length === 0) {
      return;
    }

    const input: PutMetricDataCommandInput = {
      Namespace: this.metricNamespace,
      MetricData: this.queue.getMetricData(),
    };
    const command = new PutMetricDataCommand(input);

    this.queue.clear();

    try {
      await this.cloudWatchClient.send(command);
    } catch (e) {
      console.error('Error during metric recorder emitting metrics:', e);
    }
  }
}

export const cloudWatchMetricsRecorder = new CloudWatchMetricsRecorder(
  authService,
);
