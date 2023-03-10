/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DashboardWidget = {
  properties: {
    title: {
      type: 'string',
      isRequired: true,
      maxLength: 100,
      minLength: 1,
    },
    type: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const;
