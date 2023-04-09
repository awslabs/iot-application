import SpaceBetween from '@cloudscape-design/components/space-between';

import { CreateDashboardButton } from './create-dashboard-button';
import { DeleteDashboardButton } from './delete-dashboard-button';

export interface DashboardsTableActionsProps {
  /**
   * Renders the delete button in a disabled state. It is expected to be
   * disabled when no dashboards are selected on the dashboards table.
   */
  isDeleteDisabled: boolean;
  /** Called when the user clicks enabled delete button. */
  onClickDelete: () => void;
}

/** Group of buttons for managing dashboards resources. */
export function DashboardsTableActions({
  isDeleteDisabled,
  onClickDelete,
}: DashboardsTableActionsProps) {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <DeleteDashboardButton
        disabled={isDeleteDisabled}
        onClick={onClickDelete}
      />
      <CreateDashboardButton />
    </SpaceBetween>
  );
}
