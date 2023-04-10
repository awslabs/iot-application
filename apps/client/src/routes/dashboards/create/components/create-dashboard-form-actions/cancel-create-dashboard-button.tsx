import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';

import { DASHBOARDS_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

/** Button used to cancel dashboard creation and return to dashboards page */
export function CancelCreateDashboardButton() {
  const { navigate } = useApplication();

  function handleClickCancel() {
    navigate(DASHBOARDS_HREF);
  }

  return (
    <Button formAction="none" onClick={handleClickCancel}>
      <FormattedMessage
        defaultMessage="Cancel"
        description="create dashboard form cancel button"
      />
    </Button>
  );
}
