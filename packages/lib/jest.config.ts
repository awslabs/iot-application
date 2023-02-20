import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ['**/src/**/*.{js,ts}'],
  displayName: 'lib',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.*\\.ts$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(ky|ky-universal))/'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};

export default config;
