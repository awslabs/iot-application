import type { Config } from 'jest';

import baseConfig from 'jest-config/base';

const jestDynamodb = require('@shelf/jest-dynamodb/jest-preset');

const config: Config = {
  ...baseConfig,
  //https://jestjs.io/docs/dynamodb
  ...jestDynamodb,
  collectCoverageFrom: [
    '**/src/**/*.{js,ts}',
    '!./src/main.ts',
    '!./src/repl.ts',
    '!./src/app.module.ts',
    '!./src/lifecycle-hooks/dynamodb-local-setup.ts',
    '!./src/config/local-cognito-jwt-verifier.ts',
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
