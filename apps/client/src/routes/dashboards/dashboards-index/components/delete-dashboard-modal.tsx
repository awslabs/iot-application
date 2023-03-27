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
import { FormattedMessage, useIntl } from 'react-intl';

import { DashboardSummary, deleteDashboard } from 'src/services';
import { DASHBOARDS_QUERY_KEY } from '~/data/dashboards';
import { useSendNotification } from '~/hooks/notifications/use-send-notification';

const DELETE_CONSENT_TEXT = 'confirm' as const;

interface DeleteDashboardModalProps {
  dashboards: readonly DashboardSummary[];
  isVisible: boolean;
  onClose: () => void;
}

export function DeleteDashboardModal({
  dashboards,
  isVisible,
  onClose,
}: DeleteDashboardModalProps) {
  const intl = useIntl();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { consent: '' } });
  const sendNotification = useSendNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteDashboard,
    onSuccess: async () => {
      await queryClient.invalidateQueries(DASHBOARDS_QUERY_KEY);
      handleClose();
      sendNotification({
        type: 'success',
        content: intl.formatMessage({
          defaultMessage: 'Dashboard(s) deleted successfully',
        }),
      });
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
      header={intl.formatMessage({
        defaultMessage: 'Delete dashboard',
        description: 'delete dashboard modal header',
      })}
      closeAriaLabel={intl.formatMessage({
        defaultMessage: 'Close delete dialog',
        description: 'delete dashboard modal close aria label',
      })}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleClose}>
              <FormattedMessage
                defaultMessage="Cancel"
                description="delete dashboard modal cancel button"
              />
            </Button>

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
              <FormattedMessage
                defaultMessage="Delete"
                description="delete dashboard modal delete button"
              />
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
          <Link
            external={true}
            href="https://github.com/awslabs/iot-application"
          >
            <FormattedMessage
              defaultMessage="Learn more"
              description="delete dashboard modal learn more link"
            />
          </Link>
        </Alert>

        <Box>
          <FormattedMessage
            defaultMessage="To avoid accidental deletions, we ask you to provide additional written consent."
            description="delete dashboard modal consent request"
          />
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
