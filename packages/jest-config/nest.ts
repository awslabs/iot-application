import type { Config } from "jest";

import baseConfig from "./base";

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ["**/src/**/*.{js,ts}"],
  coveragePathIgnorePatterns: [],
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  transform: {
    "^.*\\.ts$": "ts-jest",
  },
};

export default config;
