/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateDashboardDto = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
      maxLength: 100,
      minLength: 1,
    },
    description: {
      type: 'string',
      isRequired: true,
      maxLength: 200,
      minLength: 1,
    },
    definition: {
      type: 'DashboardDefinition',
      isRequired: true,
    },
  },
} as const;
