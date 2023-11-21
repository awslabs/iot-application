import { registerAs } from '@nestjs/config';
import { isDefined } from '../types/environment';
import invariant from 'tiny-invariant';
import { envVarRequiredMsg } from './environment';

export const configFactory = () => {
  const { APPLICATION_NAME: applicationName } = process.env;

  invariant(isDefined(applicationName), envVarRequiredMsg('APPLICATION_NAME'));

  return {
    applicationName,
  };
};

export const globalConfig = registerAs('global', configFactory);
