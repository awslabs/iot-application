import { Outlet } from 'react-router-dom';

import { RootErrorBoundary } from './components/root-error-boundary';
import { useDetect401Unauthorized } from '~/hooks/application/use-detect-401-unauthorized';

export function RootPage() {
  useDetect401Unauthorized();

  return (
    <RootErrorBoundary>
      <Outlet />
    </RootErrorBoundary>
  );
}
