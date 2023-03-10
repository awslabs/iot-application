/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DashboardDefinition = {
  properties: {
    widgets: {
      type: 'array',
      contains: {
        type: 'DashboardWidget',
      },
      isRequired: true,
    },
  },
} as const;
