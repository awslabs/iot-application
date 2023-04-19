/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardWidget } from './DashboardWidget';
import type { DurationViewport } from './DurationViewport';
import type { HistoricalViewport } from './HistoricalViewport';

export type DashboardDefinition = {
  viewport: DurationViewport | HistoricalViewport;
  widgets: Array<DashboardWidget>;
};
