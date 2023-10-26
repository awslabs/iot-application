import { memo } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { FormattedMessage } from 'react-intl';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { dashboardMigration } from '~/services';

const click = () => {
  async () => {
    await dashboardMigration();
  };
};

const Migration = () => {
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
      <ColumnLayout columns={2}>
        <Box>
          You can migrate your dashboards from SiteWise Monitor to IoT
          Application.
        </Box>
        <Box float="right">
          <Button
            variant="primary"
            className="btn-custom-primary"
            onClick={click}
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
