import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  moduleDirectories: ["node_modules"],
  notify: true,
  reporters: [["github-actions", { silent: false }], "summary"],
};

export default config;
