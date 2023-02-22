import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: [
    '**/src/**/*.{js,ts}',
    '!./src/main.ts',
    '!./src/repl.ts',
    '!./src/app.module.ts',
    '!./src/lifecycle-hooks/dynamodb-local-setup.ts',
    '!./src/config/local-cognito-jwt-verifier.ts',
    '!./src/testing/**/*',
  ],
  displayName: 'Core',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.*\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "^uuid$": "uuid",
  },
  
};

export default config;
