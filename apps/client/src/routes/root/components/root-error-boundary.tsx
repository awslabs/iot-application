import Box from '@cloudscape-design/components/box';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import type { PropsWithChildren } from 'react';

export function RootErrorBoundary(props: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallbackRender={() => (
        <Box textAlign="center" margin={{ top: 'xxl' }}>
          <Box variant="awsui-key-label">
            <FormattedMessage
              defaultMessage="Something went wrong."
              description="root page error boundary fallback message"
            />
          </Box>
        </Box>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
