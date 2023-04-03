import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';
import { CREATE_DASHBOARD_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

export function EmptyDashboardsTable() {
  const { navigate } = useApplication();

  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        <FormattedMessage
          defaultMessage="No dashboards"
          description="empty dashboards table heading"
        />
      </Box>

      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        <FormattedMessage
          defaultMessage="No dashboards to display"
          description="empty dashboards table description"
        />
      </Box>

      <Button onClick={() => navigate(CREATE_DASHBOARD_HREF)}>
        <FormattedMessage
          defaultMessage="Create dashboard"
          description="empty dashboards table button"
        />
      </Button>
    </Box>
  );
}
