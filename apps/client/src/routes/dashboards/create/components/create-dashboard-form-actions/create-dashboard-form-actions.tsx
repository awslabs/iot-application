import SpaceBetween from '@cloudscape-design/components/space-between';

import { CancelCreateDashboardButton } from './cancel-create-dashboard-button';
import {
  ConfirmCreateDashboardButton,
  ConfirmCreateDashboardButtonProps,
} from './confirm-create-dashboard-button';

type CreateDashboardFormActionsProps = ConfirmCreateDashboardButtonProps;

/** Group of buttons for user to act on create dashboard form */
export function CreateDashboardFormActions({
  isLoading,
}: CreateDashboardFormActionsProps) {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <CancelCreateDashboardButton />
      <ConfirmCreateDashboardButton isLoading={isLoading} />
    </SpaceBetween>
  );
}
