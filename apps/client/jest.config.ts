import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ['**/src/**/*.{js,ts,jsx,tsx}'],
  displayName: 'Client',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  // required to handle CSS
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    'src/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // required to handle Cloudscape components
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // required to handle Cloudscape components
  transformIgnorePatterns: ['node_modules/(?!@awsui/components-react)/'],
};

export default config;
