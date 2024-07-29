/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DashboardWidget = {
  type:
    | 'xy-plot'
    | 'line-scatter-chart'
    | 'line-chart'
    | 'scatter-chart'
    | 'bar-chart'
    | 'kpi'
    | 'gauge'
    | 'status'
    | 'status-timeline'
    | 'table'
    | 'text';
  /**
   * Unique identifier of the widget.
   */
  id: string;
  /**
   * X position of the widget relative to grid.
   */
  x: number;
  /**
   * Y position of the widget relative to grid.
   */
  y: number;
  /**
   * Z position of the widget relative to grid.
   */
  z: number;
  /**
   * Width of the widget.
   */
  width: number;
  /**
   * Height of the widget.
   */
  height: number;
  /**
   * Widget properties. Depends on the widget type. Currently, it is not
   * validated.
   */
  properties: Record<string, any>;
};
