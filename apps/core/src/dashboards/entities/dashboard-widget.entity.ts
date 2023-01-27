import { IsEnum, IsString, Length } from "class-validator";

export type DashboardWidgetTitle = string;

export enum DashboardWidgetType {
  Line = "line",
  Scatter = "scatter",
  Bar = "bar",
  StatusGrid = "status-grid",
  StatusTimeline = "status-timeline",
  Kpi = "kpi",
  Table = "table",
}

export class DashboardWidget {
  @IsString()
  @Length(1, 100)
  public readonly title: DashboardWidgetTitle;

  @IsString()
  @IsEnum(DashboardWidgetType)
  public readonly type: DashboardWidgetType;
}
