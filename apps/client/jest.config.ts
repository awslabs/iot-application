import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: [
    '**/src/**/*.{js,ts,jsx,tsx}',
    '!**/src/**/*.d.ts',
    '!./src/test/**/*',
    '!./src/index.tsx',
    '!./src/router/router.ts',
  ],
  displayName: 'Client',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  // required to handle CSS
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      // https://formatjs.io/docs/tooling/ts-transformer#via-ts-jest-in-jestconfigjs
      {
        astTransformers: {
          before: [
            {
              path: '@formatjs/ts-transformer/ts-jest-integration',
              options: {
                overrideIdFn: '[sha512:contenthash:base64:6]',
                ast: true,
              },
            },
          ],
        },
      },
    ],

    // required to handle Cloudscape components
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // required to handle Cloudscape components
  transformIgnorePatterns: ['node_modules/(?!@awsui/components-react)/'],
};

export default config;
