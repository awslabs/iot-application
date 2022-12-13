import logger from "./LoggerFactory";

export default logger(
  import.meta.env.PROD ? "PROD" : import.meta.env.TEST ? "TEST" : "DEV",
);
