import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { FormattedMessage } from 'react-intl';

interface SettingsModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function SettingsModalFooter(props: SettingsModalFooterProps) {
  return (
    <Box float="right">
      <SpaceBetween direction="horizontal" size="xs">
        <Button variant="link" onClick={props.onCancel}>
          <FormattedMessage
            defaultMessage="Cancel"
            description="settings modal cancel button"
          />
        </Button>

        <Button variant="primary" onClick={props.onConfirm}>
          <FormattedMessage
            defaultMessage="Confirm"
            description="settings modal confirm button"
          />
        </Button>
      </SpaceBetween>
    </Box>
  );
}
