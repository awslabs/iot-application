import type { Config } from "jest";

import nestConfig from "jest-config/nest";

const config: Config = {
  ...nestConfig,
  collectCoverageFrom: [
    ...(nestConfig.collectCoverageFrom as string[]),
    "!./src/main.ts",
    "!./src/repl.ts",
    "!./src/app.module.ts",
  ],
  displayName: "Core",
  rootDir: ".",
};

export default config;
