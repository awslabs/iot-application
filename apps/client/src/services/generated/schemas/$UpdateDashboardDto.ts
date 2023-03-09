/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateDashboardDto = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
      maxLength: 40,
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
    isFavorite: {
      type: 'boolean',
      isRequired: true,
    },
  },
} as const;
