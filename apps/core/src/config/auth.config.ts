import { registerAs } from '@nestjs/config';
import { localCognitoJwtVerifier } from './local-cognito-jwt-verifier';

// TODO: construct the cognitoJwtVerifier based on environment variables
export const authConfig = registerAs('auth', () => ({
  cognitoJwtVerifier: localCognitoJwtVerifier,
}));
