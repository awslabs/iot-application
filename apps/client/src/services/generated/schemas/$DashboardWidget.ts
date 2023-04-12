/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DashboardWidget = {
  properties: {
    type: {
      type: 'Enum',
      isRequired: true,
    },
    id: {
      type: 'string',
      isRequired: true,
    },
    x: {
      type: 'number',
      isRequired: true,
    },
    y: {
      type: 'number',
      isRequired: true,
    },
    z: {
      type: 'number',
      isRequired: true,
    },
    width: {
      type: 'number',
      isRequired: true,
    },
    height: {
      type: 'number',
      isRequired: true,
    },
    properties: {
      properties: {},
      isRequired: true,
    },
  },
} as const;
