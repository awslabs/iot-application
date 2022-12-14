import * as LoggerFactory from "./LoggerFactory";

export default LoggerFactory.createLogger(
  import.meta.env.PROD ? "PROD" : import.meta.env.TEST ? "TEST" : "DEV",
);
