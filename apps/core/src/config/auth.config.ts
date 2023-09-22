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
    COGNITO_DOMAIN_NAME: domainName,
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
    // Share the AWS credentials with client
    const {
      AWS_ACCESS_KEY_ID: clientAwsAccessKeyId,
      AWS_SECRET_ACCESS_KEY: clientAwsSecretAccessKey,
      AWS_SESSION_TOKEN: clientAwsSessionToken,
    } = process.env;

    invariant(
      isDefined(clientAwsAccessKeyId),
      envVarRequiredMsg('AWS_ACCESS_KEY_ID'),
    );
    invariant(
      isDefined(clientAwsSecretAccessKey),
      envVarRequiredMsg('AWS_SECRET_ACCESS_KEY'),
    );

    return {
      authenticationFlowType: LOCAL_AUTH_FLOW_TYPE,
      clientAwsAccessKeyId,
      clientAwsSecretAccessKey,
      clientAwsSessionToken,
      cognitoEndpoint: LOCAL_COGNITO_ENDPOINT,
      identityPoolId,
      userPoolId,
      userPoolWebClientId,
      region,
      domainName,
    };
  }

  return {
    identityPoolId,
    userPoolId,
    userPoolWebClientId,
    region,
    domainName,
  };
};

export const authConfig = registerAs('auth', configFactory);
