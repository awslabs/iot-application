import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { FormattedMessage, useIntl } from 'react-intl';

import { CREATE_DASHBOARD_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

interface DashboardsTableHeaderProps {
  isDeleteDisabled: boolean;
  onClickDelete: () => void;
}

export function DashboardsTableHeader(props: DashboardsTableHeaderProps) {
  const intl = useIntl();
  const { navigate } = useApplication();

  return (
    <Header
      variant="h1"
      description={intl.formatMessage({
        defaultMessage:
          'Manage your dashboards or select one to begin monitoring your live industrial data.',
        description: 'dashboards table header description',
      })}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="primary"
            onClick={() => navigate(CREATE_DASHBOARD_HREF)}
          >
            <FormattedMessage
              defaultMessage="Create"
              description="dashboards table header create button"
            />
          </Button>

          <Button
            disabled={props.isDeleteDisabled}
            onClick={props.onClickDelete}
          >
            <FormattedMessage
              defaultMessage="Delete"
              description="dashboards table header delete button"
            />
          </Button>
        </SpaceBetween>
      }
    >
      <FormattedMessage
        defaultMessage="Dashboards"
        description="dashboards table header heading"
      />
    </Header>
  );
}
