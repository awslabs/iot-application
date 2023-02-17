import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ['**/src/**/*.{js,ts}'],
  displayName: 'lib',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.*\\.ts$': 'ts-jest',
  },
};

export default config;
