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
const dummyClientAwsAccessKeyId = 'dummyClientAwsAccessKeyId';
const dummyClientAwsSecretAccessKey = 'clientAwsSecretAccessKey';
const dummyClientAwsSessionToken = 'clientAwsSessionToken';
const dummyAuthMode = 'cognito';

describe('authConfig', () => {
  describe('configFactory', () => {
    function setCloudEnvs() {
      process.env.AWS_REGION = dummyRegion;
      process.env.AWS_ACCESS_KEY_ID = 'undefined';
      process.env.AWS_SECRET_ACCESS_KEY = 'undefined';
      process.env.AWS_SESSION_TOKEN = 'undefined';
      process.env.COGNITO_USE_LOCAL_VERIFIER = 'false';
      process.env.COGNITO_IDENTITY_POOL_ID = dummyIdentityPoolId;
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;
      process.env.AUTH_MODE = dummyAuthMode;
    }

    function setLocalEnvs() {
      process.env.AWS_REGION = dummyRegion;
      process.env.AWS_ACCESS_KEY_ID = dummyClientAwsAccessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = dummyClientAwsSecretAccessKey;
      process.env.AWS_SESSION_TOKEN = dummyClientAwsSessionToken;
      process.env.COGNITO_USE_LOCAL_VERIFIER = 'true';
      process.env.COGNITO_IDENTITY_POOL_ID = dummyIdentityPoolId;
      process.env.COGNITO_USER_POOL_ID = dummyUserPoolId;
      process.env.COGNITO_USER_POOL_CLIENT_ID = dummyUserPoolClientId;
      process.env.AUTH_MODE = dummyAuthMode;
    }

    test('returns cloud configurations', () => {
      setCloudEnvs();

      const config = configFactory();

      expect(config).toEqual({
        identityPoolId: dummyIdentityPoolId,
        userPoolId: dummyUserPoolId,
        userPoolWebClientId: dummyUserPoolClientId,
        region: dummyRegion,
        authMode: dummyAuthMode,
      });
    });

    test('returns local configurations', () => {
      setLocalEnvs();
      const config = configFactory();

      expect(config).toEqual({
        authenticationFlowType: LOCAL_AUTH_FLOW_TYPE,
        clientAwsAccessKeyId: dummyClientAwsAccessKeyId,
        clientAwsSecretAccessKey: dummyClientAwsSecretAccessKey,
        clientAwsSessionToken: dummyClientAwsSessionToken,
        cognitoEndpoint: LOCAL_COGNITO_ENDPOINT,
        identityPoolId: dummyIdentityPoolId,
        userPoolId: dummyUserPoolId,
        userPoolWebClientId: dummyUserPoolClientId,
        region: dummyRegion,
        authMode: dummyAuthMode,
      });
    });

    test('throws AWS_ACCESS_KEY_ID required error', () => {
      setLocalEnvs();
      process.env.AWS_ACCESS_KEY_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('AWS_ACCESS_KEY_ID'),
      );
    });

    test('throws AWS_SECRET_ACCESS_KEY required error', () => {
      setLocalEnvs();
      process.env.AWS_SECRET_ACCESS_KEY = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('AWS_SECRET_ACCESS_KEY'),
      );
    });

    test('throws COGNITO_IDENTITY_POOL_ID required error', () => {
      setLocalEnvs();
      process.env.COGNITO_IDENTITY_POOL_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_IDENTITY_POOL_ID'),
      );
    });

    test('throws COGNITO_USER_POOL_ID required error', () => {
      setLocalEnvs();
      process.env.COGNITO_USER_POOL_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_ID'),
      );
    });

    test('throws COGNITO_USER_POOL_CLIENT_ID_MISSING_ERROR', () => {
      setLocalEnvs();
      process.env.COGNITO_USER_POOL_CLIENT_ID = 'undefined';

      expect(() => configFactory()).toThrow(
        envVarRequiredMsg('COGNITO_USER_POOL_CLIENT_ID'),
      );
    });
  });
});
