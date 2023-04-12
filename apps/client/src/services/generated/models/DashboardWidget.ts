/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DashboardWidget = {
  type:
    | 'line-chart'
    | 'scatter-chart'
    | 'bar-chart'
    | 'kpi'
    | 'status'
    | 'status-timeline'
    | 'table'
    | 'text';
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  properties: any;
};
