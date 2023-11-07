export enum MonitorWidgetType {
  LineChart = 'sc-line-chart',
}

export interface MonitorAnalysis {
  trends: string[];
}

export interface MonitorMetric {
  type: string;
  label: string;
  assetId: string;
  propertyId: string;
  dataType: string;
  resolution?: string;
  analysis?: MonitorAnalysis;
}

export interface MonitorAnnotations {
  y: string[];
}

export interface MonitorProperties {
  colorDataAcrossThresholds: boolean;
}

export interface MonitorWidget {
  type: string;
  title: string;
  x: number;
  y: number;
  height: number;
  width: number;
  properties?: MonitorProperties;
  metrics?: MonitorMetric[];
  annotations?: MonitorAnnotations;
  alarms?: string[]; // We don't support alarms but Monitor does
}

export interface SiteWiseMonitorDashboardDefinition {
  widgets?: MonitorWidget[];
}
