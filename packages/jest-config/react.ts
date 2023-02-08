import type { Config } from "jest";

import baseConfig from "./base";

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ["**/src/**/*.{js,ts,jsx,tsx}"],
  coveragePathIgnorePatterns: [],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {},
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;
