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
      description: `Unique identifier of the widget.`,
      isRequired: true,
    },
    x: {
      type: 'number',
      description: `X position of the widget relative to grid.`,
      isRequired: true,
    },
    y: {
      type: 'number',
      description: `Y position of the widget relative to grid.`,
      isRequired: true,
    },
    z: {
      type: 'number',
      description: `Z position of the widget relative to grid.`,
      isRequired: true,
    },
    width: {
      type: 'number',
      description: `Width of the widget.`,
      isRequired: true,
    },
    height: {
      type: 'number',
      description: `Height of the widget.`,
      isRequired: true,
    },
    properties: {
      description: `Widget properties. Depends on the widget type. Currently, it is not
            validated.`,
      properties: {},
      isRequired: true,
    },
  },
} as const;
