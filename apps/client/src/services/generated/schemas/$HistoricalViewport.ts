/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HistoricalViewport = {
  properties: {
    start: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    end: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    group: {
      type: 'string',
    },
  },
} as const;
