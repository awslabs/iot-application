import { Outlet } from 'react-router-dom';

import { RootErrorBoundary } from './components/root-error-boundary';

export function RootPage() {
  return (
    <RootErrorBoundary>
      <Outlet />
    </RootErrorBoundary>
  );
}
