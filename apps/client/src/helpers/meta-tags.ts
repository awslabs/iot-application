import { Metadata } from '~/types';

export const extractedMetaTags = (
  metaElements: HTMLMetaElement[],
): Metadata => {
  const metaTags: Metadata = {
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsSessionToken: '',
    applicationName: '',
    authenticationFlowType: '',
    cognitoEndpoint: '',
    edgeEndpoint: '',
    identityPoolId: '',
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
    logMode: '',
    metricsMode: '',
    domainName: '',
    authMode: '',
  };

  metaElements.forEach(
    ({ name, content }: { name: string; content: string }) => {
      if (name in metaTags) {
        (metaTags as unknown as Record<string, string>)[name] = content;
      }
    },
  );

  return metaTags;
};
