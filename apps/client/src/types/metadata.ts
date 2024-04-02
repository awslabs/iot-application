import { AuthFlowType } from '@aws-amplify/auth/dist/esm/providers/cognito/types/models';

export interface Metadata {
  applicationName: string;
  authenticationFlowType: AuthFlowType;
  authMode: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSessionToken: string;
  cognitoEndpoint: string;
  domainName?: string;
  edgeEndpoint?: string;
  identityPoolId: string;
  logMode: string;
  metricsMode: string;
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  ssoProvider?: string;
}
