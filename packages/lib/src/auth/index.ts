import { Auth } from 'aws-amplify';

import { createAuthorizationHook } from './auth.hook';

const getAmplifyJwt = async () => {
  const session = await Auth.currentSession();
  return session.getAccessToken().getJwtToken();
};

export const authorizationHook = createAuthorizationHook(getAmplifyJwt);
