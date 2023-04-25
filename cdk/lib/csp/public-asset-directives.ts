import {
  getCognitoIdenityPoolEndpoint,
  getCognitoUserPoolEndpoint,
  getEventsControlPlaneEndpoint,
  getEventsDataPlaneEndpoint,
  getSiteWiseControlPlaneEndpoint,
  getSiteWiseDataPlaneEndpoint,
} from '../endpoints/aws-endpoints';

export function getConnectSrcDirective(
  coreServiceUrl: string,
  region: string,
): string {
  const directiveName = 'connect-src';

  const sources = [
    coreServiceUrl,
    getCognitoIdenityPoolEndpoint(region),
    getCognitoUserPoolEndpoint(region),
    getEventsControlPlaneEndpoint(region),
    getEventsDataPlaneEndpoint(region),
    getSiteWiseControlPlaneEndpoint(region),
    getSiteWiseDataPlaneEndpoint(region),
  ];

  const policy = [directiveName, ...sources].join(' ');

  return `${policy};`;
}

export function getDefaultSrcDirective(): string {
  return "default-src 'none';";
}

export function getFontSrcDirective(): string {
  return "font-src 'self' data:;";
}

export function getImgSrcDirective(): string {
  return "img-src 'self' data:;";
}

export function getScriptSrcDirective(): string {
  // FIXME: 'unsafe-eval' source to be removed after removal of NPM dependency box-intersect
  return "script-src 'self' 'unsafe-eval';";
}

export function getStyleSrcDirective(): string {
  return "style-src 'self' 'unsafe-inline';";
}

export function getPublicAssetCsp(
  coreServiceUrl: string,
  region: string,
): string {
  const directives = [
    getConnectSrcDirective(coreServiceUrl, region),
    getDefaultSrcDirective(),
    getFontSrcDirective(),
    getImgSrcDirective(),
    getScriptSrcDirective(),
    getStyleSrcDirective(),
    'upgrade-insecure-requests;',
  ];

  return directives.join(' ');
}
