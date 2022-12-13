import type Logger from "./Logger";

class DevelopmentLogger implements Logger {
  public log(message: string) {
    console.log(message);
  }

  public error(message: string) {
    console.error(message);
  }
}

export default DevelopmentLogger;
