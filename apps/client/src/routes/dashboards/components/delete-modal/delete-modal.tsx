import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import messages from '../../../../assets/messages';
import { useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  onDiscard: () => void;
  onDelete: () => void;
  name: string;
  isLoading: boolean;
}

const DELETE_CONSENT_TEXT = 'confirm';

export function DeleteModal({
  visible,
  onDiscard,
  onDelete,
  name,
  isLoading,
}: Props) {
  const [deleteInputText, setDeleteInputText] = useState('');

  useEffect(() => {
    setDeleteInputText('');
  }, [visible]);

  const isConsentGiven = deleteInputText === DELETE_CONSENT_TEXT;

  return (
    <Modal
      visible={visible}
      header={messages.deleteDashboard}
      onDismiss={onDiscard}
      closeAriaLabel="Close delete dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDiscard}>
              {messages.cancel}
            </Button>

            <Button
              variant="primary"
              disabled={!isConsentGiven}
              onClick={onDelete}
              loading={isLoading}
            >
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

        <Alert type="warning" statusIconAriaLabel="Warning">
          Proceeding with this action will delete the dashboard with all its
          content and can affect related resources.{' '}
          <Link external={true} href="https://github.com">
            Learn more
          </Link>
        </Alert>

        <Box>
          To avoid accidental deletions, we ask you to provide additional
          written consent.
        </Box>

        <ColumnLayout columns={2}>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (isConsentGiven) {
                onDelete();
              }
            }}
          >
            <FormField
              label={`To confirm deletion, type "${DELETE_CONSENT_TEXT}"`}
            >
              <Input
                placeholder={DELETE_CONSENT_TEXT}
                onChange={(event) => setDeleteInputText(event.detail.value)}
                value={deleteInputText}
                ariaRequired={true}
              />
            </FormField>
          </form>
        </ColumnLayout>
      </SpaceBetween>
    </Modal>
  );
}
