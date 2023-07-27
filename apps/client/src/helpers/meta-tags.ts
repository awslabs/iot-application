export const extractedMetaTags = (metaElements: HTMLMetaElement[]) => {
  const metaTags = {
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
