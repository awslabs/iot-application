import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useSendNotification } from 'src/layout/components/Notifications';
import messages from 'src/assets/messages';
import { createDashboard, Dashboard, $Dashboard, ApiError } from 'src/services';

export function CreateDashboardForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', description: '' },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sendNotification = useSendNotification();

  const createDashboardMutation = useMutation({
    mutationFn: (
      dashboard: Omit<Dashboard, 'id' | 'lastUpdateDate' | 'creationDate'>,
    ) => {
      return createDashboard(dashboard);
    },
    onMutate: async () => {
      await queryClient.cancelQueries(['dashboards', 'summaries']);
    },
    onError: (error) => {
      if (error instanceof Error) {
        if (error instanceof ApiError) {
          if (error.status >= 500) {
            return;
          }
        }

        sendNotification({
          id: error.message,
          type: 'success',
          content: 'Dashboard created successfully.',
        });
      }
    },
    onSuccess: async (newDashboard) => {
      await queryClient.invalidateQueries(['dashboards', 'summaries']);

      sendNotification({
        id: newDashboard.id,
        type: 'success',
        content: 'Dashboard created successfully.',
      });

      navigate('/dashboards');
    },
  });

  function getErrorText() {
    if (createDashboardMutation.error instanceof ApiError) {
      if (createDashboardMutation.error.status >= 500) {
        return createDashboardMutation.error.message;
      }
    }

    return '';
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void handleSubmit((formData) => {
          createDashboardMutation.mutate({
            name: formData.name,
            description: formData.description,
            isFavorite: false,
            definition: { widgets: [] },
          });
        })();
      }}
    >
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => navigate(-1)}>{messages.cancel}</Button>

            <Button
              variant="primary"
              loading={createDashboardMutation.isLoading}
            >
              {messages.createDashboard}
            </Button>
          </SpaceBetween>
        }
        errorText={getErrorText()}
      >
        <Container>
          <SpaceBetween size="l">
            <Controller
              control={control}
              name="name"
              rules={{
                required: 'Dashboard name is required',
                minLength: {
                  value: $Dashboard.properties.name.minLength,
                  message: 'Dashboard name must be at least 1 character.',
                },
                maxLength: {
                  value: $Dashboard.properties.name.maxLength,
                  message: `Dashboard name must be ${$Dashboard.properties.name.maxLength} characters or less.`,
                },
              }}
              render={({ field }) => (
                <FormField
                  label="Dashboard name"
                  description="Enter the name you want to give to your dashboard."
                  constraintText={`Name must be between
                    ${$Dashboard.properties.name.minLength} and
                    ${$Dashboard.properties.name.maxLength} characters.`}
                  errorText={errors[field.name]?.message}
                >
                  <Input
                    ariaRequired
                    autoFocus
                    onChange={(event) => field.onChange(event.detail.value)}
                    placeholder="Dashboard name"
                    value={field.value}
                  />
                </FormField>
              )}
            />

            <Controller
              control={control}
              name="description"
              rules={{
                required: 'Dashboard description is required',
                minLength: {
                  value: $Dashboard.properties.description.minLength,
                  message:
                    'Dashboard description must be at least 1 character.',
                },
                maxLength: {
                  value: $Dashboard.properties.description.maxLength,
                  message: `Dashboard description must be ${$Dashboard.properties.name.maxLength} characters or less.`,
                },
              }}
              render={({ field }) => (
                <FormField
                  label="Dashboard description"
                  description="Enter the description for your dashboard."
                  constraintText={`Descriptions must be between ${$Dashboard.properties.description.minLength} and
                    ${$Dashboard.properties.description.maxLength} characters.`}
                  errorText={errors[field.name]?.message}
                >
                  <Textarea
                    ariaRequired
                    onChange={(event) => field.onChange(event.detail.value)}
                    placeholder="Dashboard description"
                    value={field.value}
                  />
                </FormField>
              )}
            />
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
