import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { localCognitoJwtVerifier } from '../config/local-cognito-jwt-verifier';
import { CognitoJwtAuthGuard } from './cognito-jwt-auth.guard';
import { isPublicMetadataKey } from './public.decorator';

const constructExecutionContext = (headers?: { authorization?: string }) => {
  const notImplementedFunction = jest.fn(() => {
    throw new Error('Function not implemented.');
  });
  const httpArgumentsHost: HttpArgumentsHost = {
    getRequest: <T>(): T => ({ headers } as T),
    getResponse: notImplementedFunction,
    getNext: notImplementedFunction,
  };
  const executionContext: ExecutionContext = {
    getClass: <T>(): T => Object as T,
    getHandler: jest.fn(() => jest.fn()),
    getArgs: notImplementedFunction,
    getArgByIndex: notImplementedFunction,
    switchToRpc: notImplementedFunction,
    switchToHttp: jest.fn(() => httpArgumentsHost),
    switchToWs: notImplementedFunction,
    getType: notImplementedFunction,
  };

  return executionContext;
};

const mockIsPublicReflector = (isPublic: boolean) => {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'get').mockImplementation((metadataKey) => {
    if (metadataKey === isPublicMetadataKey) {
      return isPublic;
    }

    return undefined;
  });

  return reflector;
};
const alwaysPublicReflector = mockIsPublicReflector(true);
const neverPublicReflector = mockIsPublicReflector(false);

describe('CognitoJwtAuthGuard', () => {
  test('allows public request to skip verification', async () => {
    const cognitoJwtAuthGuard = new CognitoJwtAuthGuard(
      {
        cognitoJwtVerifier: localCognitoJwtVerifier,
      },
      alwaysPublicReflector,
    );

    await expect(
      cognitoJwtAuthGuard.canActivate(constructExecutionContext()),
    ).resolves.toBe(true);
  });

  test('allows request with verified token to proccess', async () => {
    const verifyFnSpy = jest
      .spyOn(localCognitoJwtVerifier, 'verify')
      .mockResolvedValue({
        auth_time: 1676836522,
        client_id: 'mock-client-id',
        iat: 1676836522,
        jti: 'mock-jti',
        scope: 'mock-scope',
        sub: 'mock-sub',
        token_use: 'access',
        username: 'mock-user',
        exp: 1676922922,
        iss: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_mock-user-pool-id',
        version: 123,
        origin_jti: 'mock-origin-jti',
      });
    const cognitoJwtAuthGuard = new CognitoJwtAuthGuard(
      {
        cognitoJwtVerifier: localCognitoJwtVerifier,
      },
      neverPublicReflector,
    );

    await expect(
      cognitoJwtAuthGuard.canActivate(
        constructExecutionContext({
          authorization: 'Bearer jwt-token',
        }),
      ),
    ).resolves.toBe(true);
    expect(verifyFnSpy).toBeCalledWith('jwt-token');
  });

  test('rejests request with unverified token to proccess', async () => {
    const verifyFnSpy = jest
      .spyOn(localCognitoJwtVerifier, 'verify')
      .mockRejectedValue(new Error('Invalid Token'));
    const cognitoJwtAuthGuard = new CognitoJwtAuthGuard(
      {
        cognitoJwtVerifier: localCognitoJwtVerifier,
      },
      neverPublicReflector,
    );

    await expect(
      cognitoJwtAuthGuard.canActivate(
        constructExecutionContext({
          authorization: 'Bearer bad-jwt-token',
        }),
      ),
    ).rejects.toEqual(new UnauthorizedException());
    expect(verifyFnSpy).toBeCalledWith('bad-jwt-token');
  });

  test('rejests request without request headers', async () => {
    const verifyFnSpy = jest
      .spyOn(localCognitoJwtVerifier, 'verify')
      .mockRejectedValue(new Error('Invalid Token'));
    const cognitoJwtAuthGuard = new CognitoJwtAuthGuard(
      {
        cognitoJwtVerifier: localCognitoJwtVerifier,
      },
      neverPublicReflector,
    );

    await expect(
      cognitoJwtAuthGuard.canActivate(constructExecutionContext()),
    ).rejects.toEqual(new UnauthorizedException());
    expect(verifyFnSpy).toBeCalledWith('');
  });

  test('rejests request without authorization header', async () => {
    const verifyFnSpy = jest
      .spyOn(localCognitoJwtVerifier, 'verify')
      .mockRejectedValue(new Error('Invalid Token'));
    const cognitoJwtAuthGuard = new CognitoJwtAuthGuard(
      {
        cognitoJwtVerifier: localCognitoJwtVerifier,
      },
      neverPublicReflector,
    );

    await expect(
      cognitoJwtAuthGuard.canActivate(constructExecutionContext({})),
    ).rejects.toEqual(new UnauthorizedException());
    expect(verifyFnSpy).toBeCalledWith('');
  });
});
