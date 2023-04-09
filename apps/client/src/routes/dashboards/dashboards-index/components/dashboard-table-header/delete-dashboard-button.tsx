import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';

interface DeleteDashboardButtonProps {
  disabled: boolean;
  onClick: () => void;
}

/** Button used to delete selected dashboards. */
export function DeleteDashboardButton({
  disabled,
  onClick,
}: DeleteDashboardButtonProps) {
  return (
    <Button disabled={disabled} onClick={onClick}>
      <FormattedMessage
        defaultMessage="Delete"
        description="dashboards table header delete button"
      />
    </Button>
  );
}
