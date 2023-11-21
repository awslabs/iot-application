import { configFactory } from './global.config';
import { envVarRequiredMsg } from './environment';

describe('globalConfig', () => {
  describe('configFactory', () => {
    test('returns environment values', () => {
      const applicationName = 'ApplicationName';

      process.env.APPLICATION_NAME = applicationName;

      expect(configFactory()).toEqual({
        applicationName: applicationName,
      });
    });

    test('throws APPLICATION_NAME_MISSING_ERROR', () => {
      process.env.APPLICATION_NAME = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('APPLICATION_NAME'),
      );
    });
  });
});
