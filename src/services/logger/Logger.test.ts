import LoggerFactory from "./LoggerFactory";

test("a user can log a message in development", () => {
  const logger = LoggerFactory("DEV");
  logger.log("message");
});

test("a user can log a message during testing", () => {
  const logger = LoggerFactory("TEST");
  logger.log("message");
});

test("a user can log a message in production", () => {
  const logger = LoggerFactory("PROD");
  logger.log("message");
});

test("a user can log an error message in development", () => {
  const logger = LoggerFactory("DEV");
  logger.error("message");
});

test("a user can log an error message during testing", () => {
  const logger = LoggerFactory("TEST");
  logger.error("message");
});

test("a user can log an error message in production", () => {
  const logger = LoggerFactory("PROD");
  logger.error("message");
});
