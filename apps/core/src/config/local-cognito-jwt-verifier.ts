import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { JwksCache, JwkWithKid, Jwks } from 'aws-jwt-verify/jwk';

// JwksCache built for local development, works in conjunction with cognito-local
const localJwksCache: JwksCache = {
  getJwk: (): Promise<JwkWithKid> => Promise.resolve(localJwk),
  getCachedJwk: (): JwkWithKid => localJwk,
  addJwks: (): void => {
    /** NOOP **/
  },
  getJwks: (): Promise<Jwks> => Promise.resolve(localJwks),
};
// jwk copied from https://github.com/jagregory/cognito-local/blob/master/src/keys/cognitoLocal.public.json
const localJwk = {
  kty: 'RSA',
  e: 'AQAB',
  use: 'sig',
  kid: 'CognitoLocal',
  alg: 'RS256',
  n: '2uLO7yh1_6Icfd89V3nNTc_qhfpDN7vEmOYlmJQlc9_RmOns26lg88fXXFntZESwHOm7_homO2Ih6NOtu4P5eskGs8d8VQMOQfF4YrP-pawVz-gh1S7eSvzZRDHBT4ItUuoiVP1B9HN_uScKxIqjmitpPqEQB_o2NJv8npCfqUAU-4KmxquGtjdmfctswSZGdz59M3CAYKDfuvLH9_vV6TRGgbUaUAXWC2WJrbbEXzK3XUDBrmF3Xo-yw8f3SgD3JOPl3HaaWMKL1zGVAsge7gQaGiJBzBurg5vwN61uDGGz0QZC1JqcUTl3cZnrx_L8isIR7074SJEuljIZRnCcjQ',
};
const localJwks = { keys: [localJwk] };
export const localUserPoolId = 'us-west-2_h23TJjQR9';
export const localClientId = '9cehli62qxmki9mg5adjmucuq';

export const localCognitoJwtVerifier = CognitoJwtVerifier.create(
  {
    userPoolId: localUserPoolId,
    tokenUse: 'access',
    clientId: localClientId,
  },
  {
    jwksCache: localJwksCache,
  },
);
