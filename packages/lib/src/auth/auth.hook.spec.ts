import { createAuthorizationHook, GetJwt } from './auth.hook';

describe('createAuthorizationHook', () => {
  test('jwt is appended to header', async () => {
    const jwtStub = 'abc.123.xyz';
    const mockGetJwt: GetJwt = jest.fn().mockResolvedValue(jwtStub);
    const authHook = createAuthorizationHook(mockGetJwt);

    const request = new Request('');

    expect(request.headers.has('Authorization')).toBe(false);

    await authHook(request);

    expect(request.headers.has('Authorization')).toBe(true);
  });
});
