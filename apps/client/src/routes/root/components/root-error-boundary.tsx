import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import type { PropsWithChildren } from 'react';

export function RootErrorBoundary(props: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallbackRender={() => {
        return <FormattedMessage defaultMessage="oops" />;
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
