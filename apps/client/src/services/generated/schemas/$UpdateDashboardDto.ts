/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateDashboardDto = {
  properties: {
    name: {
      type: 'string',
      maxLength: 256,
      minLength: 1,
    },
    description: {
      type: 'string',
      maxLength: 200,
      minLength: 1,
    },
    definition: {
      type: 'DashboardDefinition',
    },
  },
} as const;
