/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DurationViewport = {
  properties: {
    duration: {
      type: 'one-of',
      contains: [
        {
          type: 'number',
        },
        {
          type: 'string',
        },
      ],
      isRequired: true,
    },
    group: {
      type: 'string',
    },
  },
} as const;
