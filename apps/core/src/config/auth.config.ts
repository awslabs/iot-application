import { registerAs } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { sanitizeEnvVarOrThrow } from './environment';
import { localCognitoJwtVerifier } from './local-cognito-jwt-verifier';

const COGNITO_JWT_TOKEN_USE = 'access';
export const COGNITO_USER_POOL_ID_MISSING_ERROR = new Error(
  'Environment variable "COGNITO_USER_POOL_ID" is required for cloud usage.',
);
export const COGNITO_USER_POOL_CLIENT_ID_MISSING_ERROR = new Error(
  'Environment variable "COGNITO_USER_POOL_ID" is required for cloud usage.',
);

export const configFactory = () => {
  const {
    COGNITO_USE_LOCAL_VERIFIER,
    COGNITO_USER_POOL_ID,
    COGNITO_USER_POOL_CLIENT_ID,
  } = process.env;

  if (COGNITO_USE_LOCAL_VERIFIER === 'true') {
    return {
      cognitoJwtVerifier: localCognitoJwtVerifier,
    };
  }

  const userPoolId = sanitizeEnvVarOrThrow(
    COGNITO_USER_POOL_ID,
    COGNITO_USER_POOL_ID_MISSING_ERROR,
  );
  const clientId = sanitizeEnvVarOrThrow(
    COGNITO_USER_POOL_CLIENT_ID,
    COGNITO_USER_POOL_CLIENT_ID_MISSING_ERROR,
  );

  const cloudCognitoJwtVerifier = CognitoJwtVerifier.create({
    clientId,
    userPoolId,
    tokenUse: COGNITO_JWT_TOKEN_USE,
  });

  return {
    cognitoJwtVerifier: cloudCognitoJwtVerifier,
  };
};

export const authConfig = registerAs('auth', configFactory);
