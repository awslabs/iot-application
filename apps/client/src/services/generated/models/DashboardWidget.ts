/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DashboardWidget = {
  title: string;
  type:
    | 'line'
    | 'scatter'
    | 'bar'
    | 'status-grid'
    | 'status-timeline'
    | 'kpi'
    | 'table';
};
