import { memo } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { FormattedMessage } from 'react-intl';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { useMigrationStatusQuery } from '../hooks/use-migration-status-query';
import { useMigrationQuery } from '../hooks/use-migration-query';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { Status } from '~/services/generated/models/MigrationStatus';

const Migration = () => {
  // TODO: handle more API errors once API is implemented
  const { data, isError } = useMigrationStatusQuery();
  const { refetch, isRefetching } = useMigrationQuery();

  let statusElement;

  if (isRefetching || data?.status === Status.IN_PROGRESS) {
    statusElement = (
      <StatusIndicator type="loading">Migration in-progress</StatusIndicator>
    );
  }

  if (data?.status === Status.COMPLETE) {
    statusElement = (
      <StatusIndicator type="success">Migration complete</StatusIndicator>
    );
  }

  if (isError) {
    statusElement = (
      <StatusIndicator type="error">
        There was an error during migration
      </StatusIndicator>
    );
  }

  if (data?.status === Status.ERROR) {
    statusElement = (
      <StatusIndicator type="error">
        There was an error during migration: {data.message}
      </StatusIndicator>
    );
  }

  return (
    <ExpandableSection
      defaultExpanded={false}
      variant="container"
      headerText={
        <FormattedMessage
          defaultMessage="Dashboard migration"
          description="Migrate your dashboards from SiteWise Monitor to IoT Application."
        />
      }
    >
      <ColumnLayout columns={3}>
        <Box>
          You can migrate your dashboards from SiteWise Monitor to IoT
          Application.
        </Box>
        <Box textAlign="center">{statusElement}</Box>
        <Box float="right">
          <Button
            variant="primary"
            className="btn-custom-primary"
            onClick={() => {
              void refetch();
            }}
          >
            <span style={{ color: colorBackgroundHomeHeader }}>
              <FormattedMessage
                defaultMessage="Migrate"
                description="Migrate SiteWise Monitor Dashboards to Centurion dashboards."
              />
            </span>
          </Button>
        </Box>
      </ColumnLayout>
    </ExpandableSection>
  );
};

export default memo(Migration);
