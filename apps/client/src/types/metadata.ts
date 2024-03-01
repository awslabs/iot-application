export interface Metadata {
  applicationName: string;
  authenticationFlowType: string;
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
}
