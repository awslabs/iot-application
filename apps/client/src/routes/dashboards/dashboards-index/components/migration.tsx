import { memo } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { FormattedMessage } from 'react-intl';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { useMigrationStatusQuery } from '../hooks/use-migration-status-query';
import { useMigrationQuery } from '../hooks/use-migration-query';
import { Status } from '~/services/generated/models/MigrationStatus';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { LoadingNotification } from '~/structures/notifications/loading-notification';
import { SuccessNotification } from '~/structures/notifications/success-notification';
import { ErrorNotification } from '~/structures/notifications/error-notification';

export interface MigrationProps {
  onMigrationComplete: () => void;
}

const Migration = (props: MigrationProps) => {
  const { data, isError } = useMigrationStatusQuery();
  const { refetch, isRefetching, isLoading } = useMigrationQuery();
  const emit = useEmitNotification();

  if ((isRefetching && isLoading) || data?.status === Status.IN_PROGRESS) {
    emit(new LoadingNotification('Migration in-progress'));
  }

  if (data?.status === Status.COMPLETE) {
    emit(new SuccessNotification('Migration complete'));
    props.onMigrationComplete();
  }

  if (isError) {
    emit(new ErrorNotification('There was an error during migration'));
  }

  if (data?.status === Status.ERROR) {
    props.onMigrationComplete();
    if (data.message) {
      emit(
        new ErrorNotification(
          `There was an error during migration: ${data.message}`,
        ),
      );
    } else {
      emit(new ErrorNotification('There was an error during migration'));
    }
  }

  return (
    <ExpandableSection
      defaultExpanded={true}
      variant="container"
      headerText={
        <FormattedMessage
          defaultMessage="Dashboard migration"
          description="Migrate your dashboards from SiteWise Monitor."
        />
      }
      headerActions={
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
              description="Migrate SiteWise Monitor Dashboards to IoT Application dashboards."
            />
          </span>
        </Button>
      }
    >
      <Box>
        You can migrate your dashboards from SiteWise Monitor to IoT
        Application. This will migrate all dashboards you have in this region
        accross all portals.
      </Box>
    </ExpandableSection>
  );
};

export default memo(Migration);
