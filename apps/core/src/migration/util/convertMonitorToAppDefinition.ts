import { DashboardDefinition } from '../../dashboards/entities/dashboard-definition.entity';
import {
  DashboardWidget,
  DashboardWidgetType,
} from '../../dashboards/entities/dashboard-widget.entity';
import {
  MonitorWidgetType,
  MonitorMetric,
  SiteWiseMonitorDashboardDefinition,
} from './monitorDashboardDefinition';

const defaultResolution = '1m';
const defaultAggregationType = 'AVERAGE';

/**
 * Default Monitor size is 3x3 squares
 * Default Application size is 84x52 pixels
 */
const pixelsPerWidthUnit = 28; // 84 / 3
const pixelsPerHeightUnit = 17; // 52 / 3

const convertType = (monitorChartType: string) => {
  switch (monitorChartType) {
    case MonitorWidgetType.LineChart:
      return DashboardWidgetType.LineScatterChart;
    default:
      return DashboardWidgetType.LineScatterChart;
  }
};

const convertHeight = (height: number) => {
  return height * pixelsPerHeightUnit;
};

const convertWidth = (width: number) => {
  return width * pixelsPerWidthUnit;
};

const convertX = (x: number) => {
  return x * pixelsPerWidthUnit;
};

const convertY = (y: number) => {
  return y * pixelsPerHeightUnit;
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

const convertProperties = (monitorMetrics?: MonitorMetric[]) => {
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
    };
  }
  return defaultProperties;
};

export const convertMonitorToAppDefinition = (
  monitorDashboardDefinition?: string,
): DashboardDefinition => {
  if (monitorDashboardDefinition) {
    const definition = JSON.parse(
      monitorDashboardDefinition,
    ) as SiteWiseMonitorDashboardDefinition;

    if (definition.widgets) {
      const newDashboardDefinition: DashboardDefinition = { widgets: [] };

      for (const widget of definition.widgets) {
        const newAppWidget: DashboardWidget = {
          type: convertType(widget.type),
          id: widget.title,
          x: convertX(widget.x),
          y: convertY(widget.y),
          z: 0,
          width: convertWidth(widget.width),
          height: convertHeight(widget.height),
          properties: convertProperties(widget.metrics),
        };

        newDashboardDefinition.widgets.push(newAppWidget);
      }

      return newDashboardDefinition;
    }

    return { widgets: [] };
  }

  return { widgets: [] };
};
