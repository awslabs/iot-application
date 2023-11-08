import { convertMonitorToAppDefinition } from './convertMonitorToAppDefinition';
import { SiteWiseMonitorDashboardDefinition } from './monitorDashboardDefinition';

describe('Dashboard definition conversion', () => {
  it('converts a single SiteWise Monitor line chart into an application line chart', () => {
    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        {
          type: 'sc-line-chart',
          title: 'Total Average Power',
          x: 0,
          y: 0,
          height: 3,
          width: 3,
          metrics: [
            {
              type: 'iotsitewise',
              label: 'Total Average Power (Demo Wind Farm Asset)',
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
              dataType: 'DOUBLE',
            },
          ],
          alarms: [],
          properties: {
            colorDataAcrossThresholds: true,
          },
          annotations: {
            y: [],
          },
        },
      ],
    };
    const expectedDefinition = {
      widgets: [
        {
          type: 'xy-plot',
          x: 0,
          y: 0,
          z: 0,
          width: 99,
          height: 42,
          properties: {
            title: 'Total Average Power',
            thresholds: [],
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
            queryConfig: {
              source: 'iotsitewise',
              query: {
                properties: [],
                assets: [
                  {
                    assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
                    properties: [
                      {
                        aggregationType: 'AVERAGE',
                        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                        resolution: '1m',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts Monitor annotations into Application thresholds', () => {
    const color = '#5e87b5';
    const comparisonOperator = 'LT';
    const showValue = true;
    const value = 100;

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        {
          type: 'sc-line-chart',
          title: 'Total Average Power',
          x: 0,
          y: 0,
          height: 3,
          width: 3,
          metrics: [
            {
              type: 'iotsitewise',
              label: 'Total Average Power (Demo Wind Farm Asset)',
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
              dataType: 'DOUBLE',
            },
          ],
          alarms: [],
          properties: {
            colorDataAcrossThresholds: true,
          },
          annotations: {
            y: [
              {
                color,
                comparisonOperator,
                showValue,
                value,
              },
            ],
          },
        },
      ],
    };
    const expectedDefinition = {
      widgets: [
        {
          type: 'xy-plot',
          x: 0,
          y: 0,
          z: 0,
          width: 99,
          height: 42,
          properties: {
            title: 'Total Average Power',
            thresholds: [
              {
                color,
                comparisonOperator,
                value,
                visible: showValue,
              },
            ],
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
            queryConfig: {
              source: 'iotsitewise',
              query: {
                properties: [],
                assets: [
                  {
                    assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
                    properties: [
                      {
                        aggregationType: 'AVERAGE',
                        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                        resolution: '1m',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });
});
