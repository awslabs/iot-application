import type Logger from "./Logger";

// doesn't pollute test runner logs
class TestLogger implements Logger {
  public log() {
    // no-op
  }
  public error() {
    // no-op
  }
}

export default TestLogger;
