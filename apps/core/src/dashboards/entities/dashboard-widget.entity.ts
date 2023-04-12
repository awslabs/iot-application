import { IsEnum, IsInt, IsNumber, IsObject, IsString } from 'class-validator';

/**
 * List of available widget types.
 */
export enum DashboardWidgetType {
  LineChart = 'line-chart',
  ScatterChart = 'scatter-chart',
  BarChart = 'bar-chart',
  Kpi = 'kpi',
  Status = 'status',
  StatusTimeline = 'status-timeline',
  Table = 'table',
  Text = 'text',
}

/**
 * Generic widget entity.
 */
export class DashboardWidget {
  @IsString()
  @IsEnum(DashboardWidgetType)
  public readonly type: DashboardWidgetType;

  /**
   * Unique identifier of the widget.
   */
  @IsString()
  public readonly id: string;

  /**
   * X position of the widget relative to grid.
   */
  @IsNumber()
  public readonly x: number;

  /**
   * Y position of the widget relative to grid.
   */
  @IsNumber()
  public readonly y: number;

  /**
   * Z position of the widget relative to grid.
   */
  @IsInt()
  public readonly z: number;

  /**
   * Width of the widget.
   */
  @IsNumber()
  public readonly width: number;

  /**
   * Height of the widget.
   */
  @IsNumber()
  public readonly height: number;

  /**
   * Widget properties. Depends on the widget type. Currently, it is not
   * validated.
   */
  @IsObject()
  public readonly properties: Record<string, unknown>;
}
