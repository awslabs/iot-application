import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

class MetricHandler {
  private queue = new Set<Metric>();

  enqueue = (metric: Metric) => {
    this.queue.add(metric);
  };

  sendMetrics = (body: string) => {
    /* TODO: POST to real analytics endpoint here */
    // post('/analytics', { body })

    /* eslint-disable no-console */
    console.info(body);
  };

  flush = () => {
    if (this.queue.size > 0) {
      const body = JSON.stringify(Array.from(this.queue.values()));

      this.sendMetrics(body);

      this.queue.clear();
    }
  };

  reportWebVitals = () => {
    onCLS(this.enqueue); // Cumulative Layout Shift - how much your layouts are shifting
    onFID(this.enqueue); // First Input Delay - time from first user interaction to browser response
    onFCP(this.enqueue); // First Contentful Paint - time from page load to first content render
    onLCP(this.enqueue); // Largest Contentful Paint - render time of largest image or text block
    onTTFB(this.enqueue); // Time to First Byte - time until first response from web server

    // Report all available metrics whenever the page is backgrounded or unloaded.
    // This works for closing tabs, closing browsers, switching apps in mobile, etc.
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });

    // NOTE: Safari does not reliably fire the `visibilitychange` event when the
    // page is being unloaded, so listen to the `pagehide` event as well.
    addEventListener('pagehide', this.flush);
  };
}

export default new MetricHandler();
