import { Widget, DashboardConfiguration } from '@iot-app-kit/dashboard';
import { Dashboard } from '../types';

export const REGION = 'us-east-2';
export const DEMO_ASSET = '4db9a36d-971e-4863-b34c-b886561c8cd1';
export const DEMO_PROPERTY = '2d941621-8ea8-499f-a1bd-69522f731c9e';
export const WIDGETS: Widget[] = [
  {
    id: 'kpi-widget',
    componentTag: 'iot-kpi',
    x: 3,
    y: 9,
    z: 1,
    width: 28,
    height: 15,
    assets: [
      {
        assetId: DEMO_ASSET,
        properties: [{ propertyId: DEMO_PROPERTY }],
      },
    ],
  },
  {
    id: 'line-widget',
    componentTag: 'iot-line-chart',
    x: 31,
    y: 7,
    z: 1,
    width: 46,
    height: 35,
    assets: [
      {
        assetId: DEMO_ASSET,
        properties: [{ propertyId: DEMO_PROPERTY }],
      },
    ],
  },
];

export const DASHBOARD_CONFIGURATION: DashboardConfiguration = {
  widgets: WIDGETS,
  viewport: {
    duration: '10m',
  },
};

export const DASHBOARD_LIST: Dashboard[] = [
  {
    name: 'Dashboard 1',
    id: '56c53d6e-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
  {
    name: 'Dashboard 2',
    id: '56c54570-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
  {
    name: 'Dashboard 3',
    id: '56c546f6-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
  {
    name: 'Dashboard 4',
    id: '56c54886-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
  {
    name: 'Dashboard 5',
    id: '56c549bc-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
  {
    name: 'Dashboard 6',
    id: '56c54ad4-a599-11ed-afa1-0242ac120002',
    definition: {},
  },
];
