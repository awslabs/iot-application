import { registerAs } from '@nestjs/config';
import { isDefined } from '../types/environment';
import invariant from 'tiny-invariant';
import { envVarRequiredMsg } from './environment';
import { getLogMode, getMetricsMode } from '../types/environment';

export const configFactory = () => {
  const { APPLICATION_NAME: applicationName } = process.env;

  invariant(isDefined(applicationName), envVarRequiredMsg('APPLICATION_NAME'));

  const logMode = getLogMode();
  const metricsMode = getMetricsMode();

  invariant(isDefined(logMode), 'Something went wrong getting log mode.');
  invariant(
    isDefined(metricsMode),
    'Something went wrong getting metrics mode.',
  );

  return {
    applicationName,
    logMode,
    metricsMode,
  };
};

export const globalConfig = registerAs('global', configFactory);
