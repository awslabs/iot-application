import * as LoggerFactory from "./LoggerFactory";

test("a user can log a message in development", () => {
  const logger = LoggerFactory.createLogger("DEV");
  logger.log("message");
});

test("a user can log a message during testing", () => {
  const logger = LoggerFactory.createLogger("TEST");
  logger.log("message");
});

test("a user can log a message in production", () => {
  const logger = LoggerFactory.createLogger("PROD");
  logger.log("message");
});

test("a user can log an error message in development", () => {
  const logger = LoggerFactory.createLogger("DEV");
  logger.error("message");
});

test("a user can log an error message during testing", () => {
  const logger = LoggerFactory.createLogger("TEST");
  logger.error("message");
});

test("a user can log an error message in production", () => {
  const logger = LoggerFactory.createLogger("PROD");
  logger.error("message");
});
