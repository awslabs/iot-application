import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ["node_modules"],
  notify: true,
  //reporters: [["github-actions", { silent: false }], "summary"],
};

export default config;
