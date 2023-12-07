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
import { InfoNotification } from '~/structures/notifications/info-notification';
import { ErrorNotification } from '~/structures/notifications/error-notification';
import Modal from '@cloudscape-design/components/modal';
import { useState } from 'react';
import { SpaceBetween } from '@cloudscape-design/components';
import { useDismissAllNotifications } from '~/hooks/notifications/use-dismiss-all-notifications';

export interface MigrationProps {
  onMigrationComplete: () => void;
}

const Migration = ({ onMigrationComplete }: MigrationProps) => {
  const { data, isError } = useMigrationStatusQuery();
  const { refetch } = useMigrationQuery();
  const dismissNotifications = useDismissAllNotifications();
  const emit = useEmitNotification();
  const [modalVisible, setModalVisible] = useState(false);

  const handleStart = () => {
    dismissNotifications();
    setModalVisible(false);
    void refetch();

    emit(new LoadingNotification('Migration in-progress'));
    window.scrollTo(0, 0);
  };

  if (data?.status === Status.COMPLETE) {
    dismissNotifications();
    if (data.message) {
      emit(new SuccessNotification(data.message));
    }
    onMigrationComplete();
  }

  if (data?.status === Status.COMPLETE_NONE_CREATED) {
    dismissNotifications();
    if (data.message) {
      emit(new InfoNotification(data.message));
    }
    onMigrationComplete();
  }

  if (isError) {
    dismissNotifications();
    emit(new ErrorNotification('There was an error during migration'));
  }

  if (data?.status === Status.ERROR) {
    onMigrationComplete();
    dismissNotifications();
    if (data.message) {
      emit(new ErrorNotification(data.message));
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
            setModalVisible(true);
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
      <Modal
        onDismiss={() => setModalVisible(false)}
        visible={modalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="btn-custom-primary"
                onClick={handleStart}
              >
                <span style={{ color: colorBackgroundHomeHeader }}>
                  <FormattedMessage
                    defaultMessage="Begin"
                    description="Begin migration"
                  />
                </span>
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="Initiate migration?"
      >
        <p>
          Migrating dashbaords from SiteWise Monitor may take approximately 3-4
          minutes. There will be an alert when the migration is complete.
        </p>
        <p>
          You will be able to view your migrated dashboards in the dashboard
          collection table.
        </p>
      </Modal>
    </ExpandableSection>
  );
};

export default memo(Migration);
