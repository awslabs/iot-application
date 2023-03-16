import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

import messages from 'src/assets/messages';
import { DashboardSummary, deleteDashboard } from 'src/services';

const DELETE_CONSENT_TEXT = 'confirm' as const;

interface DeleteDashboardModalProps {
  dashboards: DashboardSummary[];
  isVisible: boolean;
  onClose: () => void;
}

export function DeleteDashboardModal({
  dashboards,
  isVisible,
  onClose,
}: DeleteDashboardModalProps) {
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { consent: '' } });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDashboard,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['dashboards', 'summaries']);
      handleClose();
    },
  });

  function handleDelete() {
    void Promise.all(
      dashboards.map((dashboard) => mutation.mutateAsync(dashboard.id)),
    );
  }

  function handleClose() {
    onClose();
    reset();
  }

  return (
    <Modal
      visible={isVisible}
      onDismiss={handleClose}
      header={messages.deleteDashboard}
      closeAriaLabel="Close delete dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleClose}>Cancel</Button>

            <Button
              disabled={!isValid}
              variant="primary"
              loading={mutation.isLoading}
              onClick={() => {
                void handleSubmit(() => {
                  handleDelete();
                })();
              }}
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

              void handleSubmit(() => {
                handleDelete();
              })();
            }}
          >
            <Form>
              <Controller
                name="consent"
                control={control}
                rules={{ required: true, pattern: /^confirm$/ }}
                render={({ field }) => (
                  <FormField>
                    <Input
                      autoFocus
                      ariaRequired
                      placeholder={DELETE_CONSENT_TEXT}
                      onChange={(event) => field.onChange(event.detail.value)}
                      value={field.value}
                    />
                  </FormField>
                )}
              />
            </Form>
          </form>
        </ColumnLayout>
      </SpaceBetween>
    </Modal>
  );
}
