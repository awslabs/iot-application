/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Dashboard = {
  properties: {
    id: {
      type: 'string',
      isRequired: true,
      maxLength: 12,
      minLength: 12,
    },
    name: {
      type: 'string',
      isRequired: true,
      maxLength: 100,
      minLength: 1,
    },
    description: {
      type: 'string',
      isRequired: true,
      maxLength: 1024,
    },
    definition: {
      type: 'DashboardDefinition',
      isRequired: true,
    },
  },
} as const;
