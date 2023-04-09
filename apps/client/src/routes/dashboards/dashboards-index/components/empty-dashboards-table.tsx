import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { FormattedMessage, useIntl } from 'react-intl';
import { CREATE_DASHBOARD_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

export function EmptyDashboardsTable() {
  const { navigate } = useApplication();
  const intl = useIntl();

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

      <Button
        ariaLabel={intl.formatMessage({
          defaultMessage: 'Create dashboard empty',
          description: 'empty dashboards table button aria label',
        })}
        onClick={() => navigate(CREATE_DASHBOARD_HREF)}
      >
        <FormattedMessage
          defaultMessage="Create dashboard"
          description="empty dashboards table button"
        />
      </Button>
    </Box>
  );
}
