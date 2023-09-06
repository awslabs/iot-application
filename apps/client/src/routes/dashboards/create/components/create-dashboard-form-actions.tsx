import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { FormattedMessage } from 'react-intl';

import { DASHBOARDS_HREF } from '~/constants';
import { useApplication } from '~/hooks/application/use-application';

interface CreateDashboardFormActionsProps {
  isLoading: boolean;
}

export function CreateDashboardFormActions(
  props: CreateDashboardFormActionsProps,
) {
  const { navigate } = useApplication();

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button
        formAction="none"
        variant="link"
        onClick={() => navigate(DASHBOARDS_HREF)}
      >
        <FormattedMessage
          defaultMessage="Cancel"
          description="create dashboard form cancel button"
        />
      </Button>

      <Button
        variant="primary"
        loading={props.isLoading}
        formAction="submit"
        className="btn-custom-primary"
      >
        <span style={{ color: colorBackgroundHomeHeader }}>
          <FormattedMessage
            defaultMessage="Create dashboard"
            description="create dashboard form confirm button"
          />
        </span>
      </Button>
    </SpaceBetween>
  );
}
