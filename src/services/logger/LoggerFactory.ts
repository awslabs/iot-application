import type Logger from "./Logger";
import DevelopmentLogger from "./DevelopmentLogger";
import ProductionLogger from "./ProductionLogger";
import TestLogger from "./TestLogger";

// Logger interface is returned explicitly, instead of a concrete
// logger implementation, allowing the logger implementation to be
// bound at build-time or runtime.
export default function createLogger(env: "DEV" | "TEST" | "PROD"): Logger {
  return env === "PROD"
    ? new ProductionLogger()
    : env === "TEST"
    ? new TestLogger()
    : new DevelopmentLogger();
}
