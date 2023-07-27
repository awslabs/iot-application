import { registerAs } from '@nestjs/config';
import { isDefined } from '../types/environment';
import invariant from 'tiny-invariant';
import { envVarRequiredMsg } from './environment';

export const configFactory = () => {
  const {
    DATABASE_LAUNCH_LOCAL,
    DATABASE_ENDPOINT: endpoint,
    DATABASE_TABLE_NAME: tableName,
    DATABASE_PORT,
  } = process.env;

  const launchLocal = DATABASE_LAUNCH_LOCAL === 'true';
  // port is for local consumption only; default to 8000 to work with local environments
  const port = DATABASE_PORT !== undefined ? parseInt(DATABASE_PORT) : 8000;
  invariant(isDefined(tableName), envVarRequiredMsg('DATABASE_TABLE_NAME'));

  return {
    launchLocal,
    port,
    endpoint,
    tableName,
  };
};

export const databaseConfig = registerAs('database', configFactory);
