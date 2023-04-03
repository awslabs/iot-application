import { Outlet } from 'react-router-dom';

import { Layout } from '../../layout/layout';

import { RootErrorBoundary } from './components/root-error-boundary';

export function RootPage() {
  return (
    <Layout>
      <RootErrorBoundary>
        <Outlet />
      </RootErrorBoundary>
    </Layout>
  );
}
