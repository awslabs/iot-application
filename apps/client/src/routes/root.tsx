import { Outlet } from 'react-router-dom';

//import { Authenticator } from '@aws-amplify/ui-react';

import { Layout } from 'src/layout/Layout';

export function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
