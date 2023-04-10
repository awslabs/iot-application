import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';

export interface ConfirmCreateDashboardButtonProps {
  /** Should be active when dashboard creation is in progress */
  isLoading: boolean;
}

/**
 * Button used to initiate create dashboard request. It relies on form
 * submission to trigger the request.
 */
export function ConfirmCreateDashboardButton({
  isLoading,
}: ConfirmCreateDashboardButtonProps) {
  return (
    <Button variant="primary" loading={isLoading} formAction="submit">
      <FormattedMessage
        defaultMessage="Create"
        description="create dashboard form confirm button"
      />
    </Button>
  );
}
