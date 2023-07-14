import { configFactory } from './database.config';
import { envVarRequiredMsg } from './environment';

describe('databaseConfig', () => {
  describe('configFactory', () => {
    test('returns cloud values', () => {
      process.env.DATABASE_LAUNCH_LOCAL = 'false';
      process.env.DATABASE_TABLE_NAME = 'CloudApiResourceTable';

      expect(configFactory()).toEqual({
        launchLocal: false,
        port: 8000,
        endpoint: undefined,
        tableName: 'CloudApiResourceTable',
      });
    });

    test('throws DATABASE_TABLE_NAME_MISSING_ERROR', () => {
      process.env.DATABASE_TABLE_NAME = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('DATABASE_TABLE_NAME'),
      );
    });

    test('returns local values', () => {
      process.env.DATABASE_LAUNCH_LOCAL = 'true';
      process.env.DATABASE_PORT = '1234';
      process.env.DATABASE_ENDPOINT = 'http://overriden-endpoint:1234';
      process.env.DATABASE_TABLE_NAME = 'LocalApiResourceTable';

      expect(configFactory()).toEqual({
        launchLocal: true,
        port: 1234,
        endpoint: 'http://overriden-endpoint:1234',
        tableName: 'LocalApiResourceTable',
      });
    });
  });
});
