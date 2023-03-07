import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import messages from '../../../../assets/messages';

interface Props {
  visible: boolean;
  onDiscard: () => void;
  onDelete: () => void;
  name: string;
}

export function DeleteModal({ visible, onDiscard, onDelete, name }: Props) {
  return (
    <Modal
      visible={visible}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDiscard}>
              {messages.cancel}
            </Button>

            <Button variant="primary" onClick={onDelete}>
              {messages.delete}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">
          Permanently delete dashboard{' '}
          <Box variant="span" fontWeight="bold">
            {name}
          </Box>
          ? You can’t undo this action.
        </Box>

        <Alert statusIconAriaLabel="Info">
          Proceeding with this action will delete the dashboard with all its
          content and can affect related resources.
        </Alert>
      </SpaceBetween>
    </Modal>
  );
}
