import { configFactory } from './jwt.config';
import { envVarRequiredMsg } from './environment';
import { localCognitoJwtVerifier } from './local-cognito-jwt-verifier';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const dummyUserPoolId = 'us-west-2_12345ABCD';
const dummyUserPoolClientId = '0123456789abcdefghijklmno';

describe('jwtConfig', () => {
  describe('configFactory', () => {
    test('returns cloud Cognito JWT verifier', () => {
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      const config = configFactory();

      expect(config).toEqual({
        cognitoJwtVerifier: CognitoJwtVerifier.create({
          clientId: dummyUserPoolClientId,
          userPoolId: dummyUserPoolId,
          tokenUse: 'access',
        }),
      });
    });

    test('returns local Cognito JWT verifier', () => {
      process.env.COGNITO_USE_LOCAL_VERIFIER = 'true';

      expect(configFactory()).toEqual({
        cognitoJwtVerifier: localCognitoJwtVerifier,
      });
    });

    test('throws COGNITO_USER_POOL_ID required error', () => {
      process.env.COGNITO_USER_POOL_ID = 'undefined';
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_ID'),
      );
    });

    test('throws COGNITO_USER_POOL_CLIENT_ID_MISSING_ERROR', () => {
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_CLIENT_ID'),
      );
    });
  });
});
