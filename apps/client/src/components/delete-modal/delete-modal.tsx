import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import messages from 'src/assets/messages';
import { DashboardSummary, deleteDashboard } from 'src/services';
import invariant from 'tiny-invariant';

const DELETE_CONSENT_TEXT = 'confirm' as const;
const isConsentGiven = (consentText: string) =>
  consentText === DELETE_CONSENT_TEXT;

interface UseDeleteDashboardProps {
  dashboards: DashboardSummary[];
  onSuccess?: () => void;
}

export function useDeleteDashboard({
  dashboards,
  onSuccess,
}: UseDeleteDashboardProps) {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const mutation = useMutation({
    mutationFn: deleteDashboard,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['dashboards', 'summaries']);
      setIsVisible(false);

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  function handleOnDelete() {
    void Promise.all(
      dashboards.map((dashboard) => mutation.mutateAsync(dashboard.id)),
    );
  }

  return {
    DeleteDashboardButton: () => (
      <DeleteDashboardButton
        isDisabled={dashboards.length === 0}
        onClick={() => setIsVisible(true)}
      />
    ),
    DeleteDashboardModal: () => (
      <DeleteDashboardModal
        dashboards={dashboards}
        isLoading={mutation.isLoading}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onDelete={handleOnDelete}
      />
    ),
  };
}

interface DeleteDashboardButtonProps {
  isDisabled: boolean;
  onClick: () => void;
}

export function DeleteDashboardButton({
  isDisabled,
  onClick,
}: DeleteDashboardButtonProps) {
  return (
    <Button onClick={onClick} disabled={isDisabled}>
      {messages.delete}
    </Button>
  );
}

interface DeleteDashboardModalProps {
  dashboards: DashboardSummary[];
  isLoading: boolean;
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteDashboardModal({
  dashboards,
  onClose,
  onDelete,
  isLoading,
  isVisible,
}: DeleteDashboardModalProps) {
  const [consentText, setConsentText] = useState('');

  function handleOnClose() {
    onClose();
    setConsentText('');
  }

  const isDisabled = !isConsentGiven(consentText);

  return (
    <Modal
      visible={isVisible}
      header={messages.deleteDashboard}
      onDismiss={onClose}
      closeAriaLabel="Close delete dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleOnClose}>
              {messages.cancel}
            </Button>

            <Button
              variant="primary"
              disabled={isDisabled}
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
        {dashboards.length === 1 ? (
          <Box variant="span">
            Permanently delete dashboard{' '}
            <Box variant="span" fontWeight="bold">
              {dashboards.at(0)?.name ?? 'Loading...'}
            </Box>
            ? You can’t undo this action.
          </Box>
        ) : (
          <Box variant="span">
            Permanently delete{' '}
            <Box variant="span" fontWeight="bold">
              {dashboards.length} dashboards
            </Box>
            ? You can’t undo this action.
          </Box>
        )}

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

              if (!isDisabled) {
                onDelete();
                handleOnClose();
              }

              invariant(false, 'Expected delete not to be disabled');
            }}
          >
            <FormField
              label={`To confirm deletion, type "${DELETE_CONSENT_TEXT}"`}
            >
              <Input
                placeholder={DELETE_CONSENT_TEXT}
                onChange={(event) => setConsentText(event.detail.value)}
                value={consentText}
                ariaRequired={true}
              />
            </FormField>
          </form>
        </ColumnLayout>
      </SpaceBetween>
    </Modal>
  );
}
