import { AuthFlowType } from '@aws-amplify/auth/dist/esm/providers/cognito/types/models';

export interface Metadata {
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSessionToken: string;
  applicationName: string;
  authenticationFlowType: AuthFlowType;
  cognitoEndpoint: string;
  identityPoolId: string;
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  logMode: string;
  metricsMode: string;
  authMode: string;
  domainName?: string;
}
