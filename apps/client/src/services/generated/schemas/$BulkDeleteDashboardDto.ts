/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BulkDeleteDashboardDto = {
  properties: {
    ids: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
