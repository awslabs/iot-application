import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: [
    '**/src/**/*.{js,ts}',
    '!./src/main.ts',
    '!./src/repl.ts',
    '!./src/app.module.ts',
  ],
  displayName: 'Core',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.*\\.ts$': 'ts-jest',
  },
};

export default config;
