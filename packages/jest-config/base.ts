import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  notify: true,
};

export default config;
