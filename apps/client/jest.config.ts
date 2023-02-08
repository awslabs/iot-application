import type { Config } from "jest";

import reactConfig from "jest-config/react";

const config: Config = {
  ...reactConfig,
  displayName: "Client",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  testPathIgnorePatterns: ["node_modules", "dist"],
  transform: {
    ".+\\.ts$": "ts-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!@awsui/components-react)/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
    "<rootDir>/node_modules",
  ],
  roots: ["<rootDir>/src/", "<rootDir>/node_modules/"],
  verbose: true,
};

export default config;
