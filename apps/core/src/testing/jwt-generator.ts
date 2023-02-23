import { Context } from 'cognito-local/lib/services/context';
import { JwtTokenGenerator } from 'cognito-local/lib/services/tokenGenerator';
import { Triggers } from 'cognito-local/lib/services/triggers';
import {
  localClientId,
  localUserPoolId,
} from '../config/local-cognito-jwt-verifier';

// JwtTokenGenerator and configurations
const clock = { get: () => new Date() };
const trigger = {
  enabled: () => false,
} as unknown as Triggers;
const IssuerDomain = 'https://cognito-idp.us-west-2.amazonaws.com';
const tokenConfig = {
  IssuerDomain,
};
const jwtTokenGenerator = new JwtTokenGenerator(clock, trigger, tokenConfig);

// JwtTokenGenerator.generate configurations
const ctx = {} as Context; // context with logger, unnecessary for testing
// TODO: consume from cognito-local configuration
const user = {
  Username: 'test-user',
  Password: 'test-Password!',
  Attributes: [
    {
      Name: 'sub',
      Value: 'c443af37-2eab-4465-ac94-7ec8b814abad',
    },
    {
      Name: 'email',
      Value: 'test-user@amazon.com',
    },
  ],
  Enabled: true,
  UserStatus: 'CONFIRMED',
  UserCreateDate: new Date('2023-02-18T10:18:04.493Z'),
  UserLastModifiedDate: new Date('2023-02-18T10:20:48.241Z'),
  RefreshTokens: [],
};
const userGroups: string[] = [];
const userPoolClient = {
  UserPoolId: localUserPoolId,
  ClientId: localClientId,
  ClientName: 'test-client',
  LastModifiedDate: new Date('2023-02-18T10:20:48.241Z'),
  CreationDate: new Date('2023-02-18T10:18:04.493Z'),
};
const authenticationSource = 'RefreshTokens';

/**
 * Returns Access, ID, and refresh JWT tokens that are localCognitoJwtVerifier compactible.
 * @returns Access, ID, and refresh tokens in JWT format
 */
export const getJwtTokens = async () => {
  const jwt = await jwtTokenGenerator.generate(
    ctx,
    user,
    userGroups,
    userPoolClient,
    undefined,
    authenticationSource,
  );

  return jwt;
};

export const getAccessToken = async (): Promise<string> => {
  const bearerToken = await getJwtTokens();

  return bearerToken.AccessToken;
};
