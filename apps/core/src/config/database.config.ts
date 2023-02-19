import { registerAs } from '@nestjs/config';

export const configFactory = () => ({
  // TODO: consume endpoint and tableName from environment variables
  launchLocal:
    process.env.DATABASE_LAUNCH_LOCAL === undefined
      ? true
      : process.env.DATABASE_LAUNCH_LOCAL === 'true',
  port:
    process.env.DATABASE_PORT === undefined
      ? 8000
      : parseInt(process.env.DATABASE_PORT),
  endpoint: process.env.DATABASE_ENDPOINT ?? 'http://localhost:8000',
  tableName: process.env.DATABASE_TABLE_NAME ?? 'ApiResourceTable',
});

export const databaseConfig = registerAs('database', configFactory);
