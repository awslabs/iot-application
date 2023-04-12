import { vi } from 'vitest';
import metricHandler from './metric-handler';

describe('MetricHandler', () => {
  const spy = vi.spyOn(metricHandler, 'sendMetrics');

  beforeAll(() => {
    vi.stubGlobal('document', { visibilityState: 'hidden' });

    vi.mock('web-vitals', () => ({
      onCLS: (cb: (metric: string) => void) => cb('CLS'),
      onFID: (cb: (metric: string) => void) => cb('FID'),
      onFCP: (cb: (metric: string) => void) => cb('FCP'),
      onLCP: (cb: (metric: string) => void) => cb('LCP'),
      onTTFB: (cb: (metric: string) => void) => cb('TTFB'),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('should report batches of metrics', () => {
    metricHandler.reportWebVitals();

    metricHandler.flush();

    expect(spy).toHaveBeenCalledWith('["CLS","FID","FCP","LCP","TTFB"]');
  });
});
