import { registerAs } from '@nestjs/config';
import invariant from 'tiny-invariant';
import { isDefined } from '../types/environment';
import { envVarRequiredMsg } from './environment';

export const LOCAL_AUTH_FLOW_TYPE = 'USER_PASSWORD_AUTH';
export const LOCAL_COGNITO_ENDPOINT = 'http://localhost:9229';

export const configFactory = () => {
  const {
    AWS_REGION: region,
    COGNITO_IDENTITY_POOL_ID: identityPoolId,
    COGNITO_USE_LOCAL_VERIFIER: useLocalVerifier,
    COGNITO_USER_POOL_ID: userPoolId,
    COGNITO_USER_POOL_CLIENT_ID: userPoolWebClientId,
  } = process.env;

  invariant(
    isDefined(identityPoolId),
    envVarRequiredMsg('COGNITO_IDENTITY_POOL_ID'),
  );
  invariant(isDefined(userPoolId), envVarRequiredMsg('COGNITO_USER_POOL_ID'));
  invariant(
    isDefined(userPoolWebClientId),
    envVarRequiredMsg('COGNITO_USER_POOL_CLIENT_ID'),
  );

  if (useLocalVerifier === 'true') {
    return {
      authenticationFlowType: LOCAL_AUTH_FLOW_TYPE,
      cognitoEndpoint: LOCAL_COGNITO_ENDPOINT,
      identityPoolId,
      userPoolId,
      userPoolWebClientId,
      region,
    };
  }

  return {
    identityPoolId,
    userPoolId,
    userPoolWebClientId,
    region,
  };
};

export const authConfig = registerAs('auth', configFactory);
