import Button from '@cloudscape-design/components/button';
import { FormattedMessage } from 'react-intl';

import { CREATE_DASHBOARD_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

/** Button used to navigate to the create dashboard page. */
export function CreateDashboardButton() {
  const { navigate } = useApplication();

  function handleClickCreate() {
    // push user to the create dashboard page
    navigate(CREATE_DASHBOARD_HREF);
  }

  return (
    <Button variant="primary" onClick={handleClickCreate}>
      <FormattedMessage
        defaultMessage="Create dashboard"
        description="dashboards table header create button"
      />
    </Button>
  );
}
