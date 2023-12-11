/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DashboardSummary = {
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
      maxLength: 256,
      minLength: 1,
    },
    description: {
      type: 'string',
      isRequired: true,
      maxLength: 200,
      minLength: 1,
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
