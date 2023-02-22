import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ['**/src/**/*.{js,ts}', '!**/src/**/index.ts'],
  displayName: 'lib',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^ky$': 'ky/distribution',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/?!ky/distribution'],
};

export default config;
