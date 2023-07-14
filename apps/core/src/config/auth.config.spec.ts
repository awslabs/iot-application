import {
  LOCAL_AUTH_FLOW_TYPE,
  LOCAL_COGNITO_ENDPOINT,
  configFactory,
} from './auth.config';
import { envVarRequiredMsg } from './environment';

const dummyIdentityPoolId = 'us-west-2:01234567-0123-0123-0123-0123456789ab';
const dummyRegion = 'us-west-2';
const dummyUserPoolId = 'us-west-2_12345ABCD';
const dummyUserPoolClientId = '0123456789abcdefghijklmno';

describe('authConfig', () => {
  describe('configFactory', () => {
    test('returns cloud configurations', () => {
      process.env.AWS_REGION = dummyRegion;
      process.env.COGNITO_IDENTITY_POOL_ID = dummyIdentityPoolId;
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      const config = configFactory();

      expect(config).toEqual({
        identityPoolId: dummyIdentityPoolId,
        userPoolId: dummyUserPoolId,
        userPoolWebClientId: dummyUserPoolClientId,
        region: dummyRegion,
      });
    });

    test('returns local configurations', () => {
      process.env.AWS_REGION = dummyRegion;
      process.env.COGNITO_USE_LOCAL_VERIFIER = 'true';
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      const config = configFactory();

      expect(config).toEqual({
        authenticationFlowType: LOCAL_AUTH_FLOW_TYPE,
        cognitoEndpoint: LOCAL_COGNITO_ENDPOINT,
        identityPoolId: dummyIdentityPoolId,
        userPoolId: dummyUserPoolId,
        userPoolWebClientId: dummyUserPoolClientId,
        region: dummyRegion,
      });
    });

    test('throws COGNITO_IDENTITY_POOL_ID required error', () => {
      process.env.COGNITO_IDENTITY_POOL_ID = 'undefined';
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_IDENTITY_POOL_ID'),
      );
    });

    test('throws COGNITO_USER_POOL_ID required error', () => {
      process.env.COGNITO_IDENTITY_POOL_ID = dummyIdentityPoolId;
      process.env.COGNITO_USER_POOL_ID = 'undefined';
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_ID'),
      );
    });

    test('throws COGNITO_USER_POOL_CLIENT_ID_MISSING_ERROR', () => {
      process.env.COGNITO_IDENTITY_POOL_ID = dummyIdentityPoolId;
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_CLIENT_ID'),
      );
    });
  });
});
