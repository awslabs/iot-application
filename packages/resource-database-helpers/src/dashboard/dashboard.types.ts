export type DashboardId = string;
export type DashboardName = string;
export type DashboardDescription = string;

export type DashboardSummary = {
    id: DashboardId,
    name: DashboardName,
    description: DashboardDescription,
    creationDate: Date,
    lastUpdateDate: Date,
};

export type DashboardWidgetTitle = string;

export enum DashboardWidgetType {
  Line = 'line',
  Scatter = 'scatter',
  Bar = 'bar',
  StatusGrid = 'status-grid',
  StatusTimeline = 'status-timeline',
  Kpi = 'kpi',
  Table = 'table',
}

export type DashboardWidget = {
  title: DashboardWidgetTitle;
  type: DashboardWidgetType;
};

export type DashboardDefinition = {
  widgets: DashboardWidget[];
};


export type Dashboard = DashboardSummary & {
  definition: DashboardDefinition,
};
