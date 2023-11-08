import { DashboardDefinition } from '../../dashboards/entities/dashboard-definition.entity';
import {
  DashboardWidget,
  DashboardWidgetType,
} from '../../dashboards/entities/dashboard-widget.entity';
import {
  MonitorWidgetType,
  MonitorMetric,
  SiteWiseMonitorDashboardDefinition,
  MonitorAnnotations,
} from './monitorDashboardDefinition';
import { nanoid } from 'nanoid';

const defaultResolution = '1m';
const defaultAggregationType = 'AVERAGE';

/**
 * Default Monitor size is 3x3 squares
 * A similar sized application dashboard is 99x42 cells
 */
const appCellsPerMonitorSquareWidth = 33; // 99 / 3
const appCellPerMonitorSquareHeight = 14; // 42 / 3

const convertType = (monitorChartType: string) => {
  switch (monitorChartType) {
    case MonitorWidgetType.LineChart:
      return DashboardWidgetType.XYPlot;
    default:
      return DashboardWidgetType.XYPlot;
  }
};

const convertHeight = (height: number) => {
  return height * appCellPerMonitorSquareHeight;
};

const convertWidth = (width: number) => {
  return width * appCellsPerMonitorSquareWidth;
};

const convertX = (x: number) => {
  return x * appCellsPerMonitorSquareWidth;
};

const convertY = (y: number) => {
  return y * appCellPerMonitorSquareHeight;
};

const convertResolution = (resolution?: string) => {
  if (resolution) {
    if (resolution === 'raw') {
      return defaultResolution;
    }
    return resolution;
  }
  return defaultResolution;
};

const convertThresholds = (monitorAnnotations?: MonitorAnnotations) => {
  // Annotations are only added to the y axis array in Monitor
  if (monitorAnnotations?.y) {
    const applicationThresholds = [];
    for (const annotation of monitorAnnotations.y) {
      const newThreshold = {
        id: nanoid(12),
        visible: annotation.showValue,
        color: annotation.color,
        value: annotation.value,
        comparisonOperator: annotation.comparisonOperator,
      };
      applicationThresholds.push(newThreshold);
    }
    return { thresholds: applicationThresholds };
  }
  return undefined;
};

const convertProperties = (
  monitorMetrics?: MonitorMetric[],
  monitorAnnotations?: MonitorAnnotations,
  monitorTitle?: string,
) => {
  const defaultProperties = {
    symbol: {
      style: 'filled-circle',
    },
    axis: {
      yVisible: true,
      xVisible: true,
    },
    line: {
      connectionStyle: 'linear',
      style: 'solid',
    },
    legend: {
      visible: true,
    },
  };

  if (monitorMetrics) {
    const assets = [];

    for (const metric of monitorMetrics) {
      const asset = {
        assetId: metric.assetId,
        properties: [
          {
            aggregationType: defaultAggregationType, // Monitor has no aggregationType and appliation defaults to AVERAGE
            propertyId: metric.propertyId,
            resolution: convertResolution(metric.resolution),
          },
        ],
      };

      assets.push(asset);
    }

    const queryConfig = {
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets,
        },
      },
    };

    return {
      ...defaultProperties,
      ...queryConfig,
      ...convertThresholds(monitorAnnotations),
      title: monitorTitle,
    };
  }
  return defaultProperties;
};

export const convertMonitorToAppDefinition = (
  monitorDashboardDefinition: SiteWiseMonitorDashboardDefinition,
): DashboardDefinition => {
  const newDashboardDefinition: DashboardDefinition = { widgets: [] };

  let numWidgets = 0;

  if (monitorDashboardDefinition.widgets) {
    for (const widget of monitorDashboardDefinition.widgets) {
      const newAppWidget: DashboardWidget = {
        type: convertType(widget.type),
        id: nanoid(12),
        x: convertX(widget.x),
        y: convertY(widget.y),
        z: numWidgets, // Stack widgets in case of overlap
        width: convertWidth(widget.width),
        height: convertHeight(widget.height),
        properties: convertProperties(
          widget.metrics,
          widget.annotations,
          widget.title,
        ),
      };

      numWidgets++;
      newDashboardDefinition.widgets.push(newAppWidget);
    }
  }

  return newDashboardDefinition;
};
