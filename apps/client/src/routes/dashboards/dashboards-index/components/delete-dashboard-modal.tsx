import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import invariant from 'tiny-invariant';

import { isApiError } from '~/helpers/predicates/is-api-error';
import { isJust } from '~/helpers/predicates/is-just';
import { useEmitNotification } from '~/hooks/notifications/use-emit-notification';
import { GenericErrorNotification } from '~/structures/notifications/generic-error-notification';
import { SuccessNotification } from '~/structures/notifications/success-notification';

import type { Dashboard, DashboardSummary } from '~/services';
import { useDeleteDashboardMutation } from '../hooks/use-delete-dashboard-mutation';

export interface DeleteDashboardModalProps {
  dashboards: readonly DashboardSummary[];
  isVisible: boolean;
  onClose: () => void;
}

function isPartialDeletion(
  body: unknown,
): body is { deletedIds: Dashboard['id'][] } {
  return 'deletedIds' in (body as { deletedIds: Dashboard['id'][] });
}

export function DeleteDashboardModal(props: DeleteDashboardModalProps) {
  const intl = useIntl();
  const emit = useEmitNotification();
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { consent: '' } });

  const mutation = useDeleteDashboardMutation();

  function handleDelete() {
    mutation.mutate(
      {
        ids: props.dashboards.map((dashboard) => dashboard.id),
      },
      {
        onSuccess: () => {
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
                  name: props.dashboards[0]?.name,
                },
              ),
            ),
          );
        },
        onError: (error) => {
          invariant(isApiError(error));

          if (
            props.dashboards.length > 0 &&
            isPartialDeletion(error.body) &&
            error.body.deletedIds.length > 0
          ) {
            emit(
              new GenericErrorNotification(
                new Error(
                  intl.formatMessage({
                    defaultMessage:
                      'An error occured, but partial deletion was successful.',
                    description: 'partial deletion successful message',
                  }),
                ),
              ),
            );
          } else {
            emit(new GenericErrorNotification(error));
          }
        },
      },
    );
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
          defaultMessage: 'Delete dashboard?',
          description: 'delete dashboard modal header',
        })}
        closeAriaLabel={intl.formatMessage({
          defaultMessage: 'Close delete dialog',
          description: 'delete dashboard modal close aria label',
        })}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={handleClose}>
                <FormattedMessage
                  defaultMessage="Cancel"
                  description="delete dashboard modal cancel button"
                />
              </Button>

              <Button
                disabled={!isValid}
                variant="primary"
                className="btn-custom-primary"
                loading={mutation.isLoading}
                onClick={() => {
                  void handleSubmit(() => {
                    handleDelete();
                  })();
                }}
              >
                <span style={{ color: colorBackgroundHomeHeader }}>
                  <FormattedMessage
                    defaultMessage="Delete"
                    description="delete dashboard modal delete button"
                  />
                </span>
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          {props.dashboards.length === 1 ? (
            <FormattedMessage
              defaultMessage="Do you want to permanently delete <b>{name}</b>? You can't undo this action."
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
              defaultMessage="Do you want to Permanently delete <b>{count} dashboards</b>? You can't undo this action."
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

          <Alert type="info" statusIconAriaLabel="Info">
            <FormattedMessage
              defaultMessage="Proceeding with this action will delete the dashboard with all its content."
              description="delete dashboard modal warning message"
            />
          </Alert>
        </SpaceBetween>
      </Modal>
    </>
  );
}
