import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import type { PropsWithChildren } from 'react';

export function DashboardErrorBoundary(props: PropsWithChildren) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <Box textAlign="center" margin={{ top: 'xxl' }}>
          <Box
            variant="awsui-key-label"
            margin={{
              bottom: 's',
            }}
          >
            <FormattedMessage
              defaultMessage="Something went wrong."
              description="dashboard page error boundary fallback message"
            />
          </Box>
          <Button onClick={() => resetErrorBoundary()}>
            <FormattedMessage
              defaultMessage="Try again"
              description="dashboard page error boundary fallback button"
            />
          </Button>
        </Box>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
