const appendAuthorizationHeader = (jwt: string, request: Request) => {
  request.headers.set('Authorization', `Bearer: ${jwt}`);
};

export type GetJwt = () => Promise<string>;
export const createAuthorizationHook =
  (getJwt: GetJwt) => async (request: Request) => {
    const jwt = await getJwt();
    appendAuthorizationHeader(jwt, request);
  };
