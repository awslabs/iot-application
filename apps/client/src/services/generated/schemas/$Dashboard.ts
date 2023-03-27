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
    creationDate: {
      type: 'string',
      isRequired: true,
    },
    lastUpdateDate: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
