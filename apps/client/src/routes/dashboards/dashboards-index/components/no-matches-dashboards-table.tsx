import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';

interface NoMatchDashboardsTableProps {
  onClick: () => void;
}

export function NoMatchDashboardsTable(props: NoMatchDashboardsTableProps) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        <FormattedMessage
          defaultMessage="No matches"
          description="no matches dashboards table heading"
        />
      </Box>

      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        <FormattedMessage
          defaultMessage="No matches to display"
          description="no matches dashboard table description"
        />
      </Box>

      <Button onClick={props.onClick}>
        <FormattedMessage
          defaultMessage="Clear filter"
          description="no matches dashboard table button"
        />
      </Button>
    </Box>
  );
}
