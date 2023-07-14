import { registerAs } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { localCognitoJwtVerifier } from './local-cognito-jwt-verifier';
import invariant from 'tiny-invariant';
import { isDefined } from '../types/environment';
import { envVarRequiredMsg } from './environment';

const COGNITO_JWT_TOKEN_USE = 'access';

export const configFactory = () => {
  const {
    COGNITO_USE_LOCAL_VERIFIER: useLocalVerifier,
    COGNITO_USER_POOL_ID: userPoolId,
    COGNITO_USER_POOL_CLIENT_ID: userPoolWebClientId,
  } = process.env;

  invariant(isDefined(userPoolId), envVarRequiredMsg('COGNITO_USER_POOL_ID'));
  invariant(
    isDefined(userPoolWebClientId),
    envVarRequiredMsg('COGNITO_USER_POOL_CLIENT_ID'),
  );

  if (useLocalVerifier === 'true') {
    return {
      cognitoJwtVerifier: localCognitoJwtVerifier,
    };
  }

  const cloudCognitoJwtVerifier = CognitoJwtVerifier.create({
    clientId: userPoolWebClientId,
    userPoolId,
    tokenUse: COGNITO_JWT_TOKEN_USE,
  });

  return {
    cognitoJwtVerifier: cloudCognitoJwtVerifier,
  };
};

export const jwtConfig = registerAs('jwt', configFactory);
