import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';
import { applyDensity, Density } from '@cloudscape-design/global-styles';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

type ContentDensity = 'comfortable' | 'compact';

export function useDensitySetting() {
  const [contentDensity, setContentDensity] = useLocalStorage<ContentDensity>(
    'contentDensity',
    'comfortable',
  );

  useEffect(() => {
    applyDensity(
      contentDensity === 'comfortable' ? Density.Comfortable : Density.Compact,
    );
  }, [contentDensity]);

  return { contentDensity, setContentDensity };
}

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SettingsModal(props: SettingsModalProps) {
  const { contentDensity, setContentDensity } = useDensitySetting();
  const [isComfortable, setIsComfortable] = useState(
    contentDensity === 'comfortable',
  );

  useEffect(() => {
    setIsComfortable(contentDensity === 'comfortable');
  }, [props.isVisible]);

  return (
    <Modal
      visible={props.isVisible}
      onDismiss={props.onClose}
      header="Settings"
      closeAriaLabel="Close settings"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={props.onClose}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setContentDensity(isComfortable ? 'comfortable' : 'compact');

                props.onClose();
              }}
            >
              Confirm
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <FormField
        description="Your content density setting will be
              stored by your browser."
        label="Select content density"
      >
        <Toggle
          onChange={(event) => setIsComfortable(event.detail.checked)}
          checked={isComfortable}
        >
          Comfortable
        </Toggle>
      </FormField>
    </Modal>
  );
}
