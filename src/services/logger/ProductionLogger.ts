import type Logger from "./Logger";

// TODO: Connect to CloudWatch
class ProductionLogger implements Logger {
  public log() {
    // to be implemented
  }
  public error() {
    // to be implemented
  }
}

export default ProductionLogger;
