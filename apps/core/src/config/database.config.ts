import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  endpoint: process.env.DATABASE_ENDPOINT || 'http://localhost:8000',
  tableName: process.env.DATABASE_TABLE_NAME || 'ApiResourceTable',
}));