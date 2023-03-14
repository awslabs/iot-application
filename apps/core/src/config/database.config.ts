import { registerAs } from '@nestjs/config';
import { sanitizeEnvVarOrThrow } from './environment';

export const DATABASE_TABLE_NAME_MISSING_ERROR = new Error(
  'Environment variable "DATABASE_TABLE_NAME" is required.',
);

export const configFactory = () => {
  const {
    DATABASE_LAUNCH_LOCAL,
    DATABASE_ENDPOINT,
    DATABASE_TABLE_NAME,
    DATABASE_PORT,
  } = process.env;

  const launchLocal = DATABASE_LAUNCH_LOCAL === 'true';
  // port is for local consumption only; default to 8000 to work with local environments
  const port = DATABASE_PORT !== undefined ? parseInt(DATABASE_PORT) : 8000;
  const tableName = sanitizeEnvVarOrThrow(
    DATABASE_TABLE_NAME,
    DATABASE_TABLE_NAME_MISSING_ERROR,
  );

  return {
    launchLocal,
    port,
    endpoint: DATABASE_ENDPOINT,
    tableName,
  };
};

export const databaseConfig = registerAs('database', configFactory);
