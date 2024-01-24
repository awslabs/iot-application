import { configFactory } from './global.config';
import { envVarRequiredMsg } from './environment';
import { MetricModes, LogModes } from '../types/environment';

describe('globalConfig', () => {
  describe('configFactory', () => {
    test('returns environment values in local mode', () => {
      const applicationName = 'ApplicationName';

      process.env.APPLICATION_NAME = applicationName;
      process.env.NODE_ENV = 'development';

      expect(configFactory()).toEqual({
        applicationName: applicationName,
        logMode: LogModes.Local,
        metricsMode: MetricModes.Local,
      });
    });

    test('returns environment values in cloud mode', () => {
      const applicationName = 'ApplicationName';

      process.env.APPLICATION_NAME = applicationName;
      process.env.NODE_ENV = 'production';

      expect(configFactory()).toEqual({
        applicationName: applicationName,
        logMode: LogModes.Cloud,
        metricsMode: MetricModes.Cloud,
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
