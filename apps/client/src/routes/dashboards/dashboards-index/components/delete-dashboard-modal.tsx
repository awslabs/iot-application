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
import { DevTool } from '@hookform/devtools';
import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import invariant from 'tiny-invariant';

import { invalidateDashboards } from '~/data/dashboards';
import { isApiError } from '~/helpers/predicates/is-api-error';
import { isJust } from '~/helpers/predicates';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';
import { SuccessNotification } from '~/structures/notifications/success-notification';

import type { DashboardSummary } from '~/services';
import { useDeleteDashboardMutation } from '../hooks/use-delete-dashboard-mutation';

const DELETE_CONSENT_TEXT = 'confirm' as const;

export interface DeleteDashboardModalProps {
  dashboards: readonly DashboardSummary[];
  isVisible: boolean;
  onClose: () => void;
}

export function DeleteDashboardModal(props: DeleteDashboardModalProps) {
  const intl = useIntl();
  const emit = useEmitNotification();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { consent: '' } });

  const mutation = useDeleteDashboardMutation();

  function handleDelete() {
    props.dashboards.forEach((dashboard) => {
      mutation.mutate(dashboard, {
        onSuccess: (_data, variables) => {
          void invalidateDashboards();
          handleClose();
          emit(
            new SuccessNotification(
              intl.formatMessage(
                {
                  defaultMessage:
                    'Successfully deleted {count, plural, one {dashboard "{name}"} other {# dashboards}}.',
                  description: 'delete dashboard modal success message',
                },
                {
                  count: props.dashboards.length,
                  name: variables.name,
                },
              ),
            ),
          );
        },
        onError: (error) => {
          invariant(isApiError(error));
          emit(new GenericErrorNotification(error));
        },
      });
    });
  }

  function handleClose() {
    props.onClose();
    reset();
  }

  return (
    <>
      <Modal
        visible={props.isVisible}
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
          {props.dashboards.length === 1 ? (
            <FormattedMessage
              defaultMessage="Permantly delete dashboard <b>{name}</b>? You cannot undo this action."
              description="delete dashboard modal delete dashboard message"
              values={{
                b: (n) => (
                  <Box variant="span" fontWeight="bold">
                    {n}
                  </Box>
                ),
                name: isJust(props.dashboards[0])
                  ? props.dashboards[0].name
                  : 'Loading...',
              }}
            >
              {(message) => <Box variant="span">{message}</Box>}
            </FormattedMessage>
          ) : (
            <FormattedMessage
              defaultMessage="Permanently delete <b>{count} dashboards</b>? You cannot undo this action."
              description="delete dashboard modal delete dashboards message"
              values={{
                b: (c) => (
                  <Box variant="span" fontWeight="bold">
                    {c}
                  </Box>
                ),
                count: props.dashboards.length,
              }}
            >
              {(message) => <Box variant="span">{message}</Box>}
            </FormattedMessage>
          )}

          <Alert type="warning" statusIconAriaLabel="Warning">
            <FormattedMessage
              defaultMessage="Proceeding with this action will delete the dashboard with all its content and can affect related resources."
              description="delete dashboard modal warning message"
            />
            {/* spacing before link */ ' '}
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
                  <FormField
                    label={intl.formatMessage(
                      {
                        defaultMessage:
                          'To confirm this deletion, type "{deleteConsentText}"',
                        description: 'delete dashboard modal consent label',
                      },
                      { deleteConsentText: DELETE_CONSENT_TEXT },
                    )}
                  >
                    <ColumnLayout columns={2}>
                      <Input
                        ariaRequired
                        placeholder={DELETE_CONSENT_TEXT}
                        onChange={(event) => field.onChange(event.detail.value)}
                        value={field.value}
                      />
                    </ColumnLayout>
                  </FormField>
                )}
              />
            </Form>
          </form>
        </SpaceBetween>
      </Modal>

      <DevTool control={control} />
    </>
  );
}
