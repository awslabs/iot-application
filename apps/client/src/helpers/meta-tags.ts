import { Metadata } from '~/types';

export const extractedMetaTags = (
  metaElements: HTMLMetaElement[],
): Metadata => {
  const metaTags: Metadata = {
    applicationName: '',
    authenticationFlowType: '',
    cognitoEndpoint: '',
    identityPoolId: '',
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
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
