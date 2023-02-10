import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  // TODO: consume endpoint and tableName from environment variables
  endpoint: 'http://localhost:8000',
  tableName: 'ApiResourceTable',
}));
