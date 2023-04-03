import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import { FormattedMessage } from 'react-intl';

export function DashboardLoadingState() {
  return (
    <Box textAlign="center" margin={{ top: 'xxl' }}>
      <Box variant="span" margin={{ right: 'xxs' }}>
        // <Spinner /> does not have a role="progressbar" attribute
        <span role="progressbar">
          <Spinner />
        </span>
      </Box>

      <FormattedMessage
        defaultMessage="Loading dashboard"
        description="dashboard page loading message"
      />
    </Box>
  );
}
