import Header from '@cloudscape-design/components/header';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  DashboardsTableActions,
  DashboardsTableActionsProps,
} from './dashboards-table-actions';

type DashboardsTableHeaderProps = DashboardsTableActionsProps;

/**
 * Header component for the dashboards table. It displays the title, a
 * description, and action buttons to delete and create new dashboards.
 */
export function DashboardsTableHeader({
  isDeleteDisabled,
  onClickDelete,
}: DashboardsTableHeaderProps) {
  const intl = useIntl();

  return (
    <Header
      variant="h1"
      description={intl.formatMessage({
        defaultMessage:
          'Manage your dashboards or select one to begin monitoring your live industrial data.',
        description: 'dashboards table header description',
      })}
      actions={
        <DashboardsTableActions
          isDeleteDisabled={isDeleteDisabled}
          onClickDelete={onClickDelete}
        />
      }
    >
      <FormattedMessage
        defaultMessage="Dashboards"
        description="dashboards table header heading"
      />
    </Header>
  );
}
