import { configFactory } from './database.config';

describe('databaseConfig', () => {
  describe('configFactory', () => {
    test('returns default values', () => {
      expect(configFactory()).toEqual({
        launchLocal: true,
        port: 8000,
        endpoint: 'http://localhost:8000',
        tableName: 'ApiResourceTable',
        region: 'us-west-2',
      });
    });

    test('returns overriden values', () => {
      process.env.DATABASE_PORT = '1234';
      process.env.DATABASE_ENDPOINT = 'http://overriden-endpoint:1234';
      process.env.DATABASE_TABLE_NAME = 'overriden-table-name';
      process.env.DATABASE_LAUNCH_LOCAL = 'false';
      process.env.DATABASE_REGION = 'us-east-1';

      expect(configFactory()).toEqual({
        launchLocal: false,
        port: 1234,
        endpoint: 'http://overriden-endpoint:1234',
        tableName: 'overriden-table-name',
        region: 'us-east-1',
      });
    });
  });
});
