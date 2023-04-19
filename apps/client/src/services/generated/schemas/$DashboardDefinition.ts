/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DashboardDefinition = {
  properties: {
    viewport: {
      type: 'one-of',
      contains: [
        {
          type: 'DurationViewport',
        },
        {
          type: 'HistoricalViewport',
        },
      ],
      isRequired: true,
    },
    widgets: {
      type: 'array',
      contains: {
        type: 'DashboardWidget',
      },
      isRequired: true,
    },
  },
} as const;
