import {
  Button,
  ContentLayout,
  SpaceBetween,
  Container,
  Header,
} from '@cloudscape-design/components';
import messages from '../../assets/messages';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from 'src/components';
import {
  Dashboard,
  createDashboard,
  $Dashboard,
  ApiError,
} from '../../services/';
import { Layout } from 'src/components';
import { ControlledForm } from 'src/components/input';

export const NEW_DASHBOARD_ROUTE = {
  path: 'new',
  element: <NewDashboardPage />,
};

export function NewDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { setNotifications } = useNotifications();

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

        setNotifications((prevNotifications) => {
          return [
            ...prevNotifications,
            {
              id: error.message,
              type: 'success',
              content: 'Dashboard created successfully.',
              dismissible: true,
              onDismiss: () => {
                setNotifications((prev) => {
                  return prev.filter((n) => n.id !== error.message);
                });
              },
            },
          ];
        });
      }
    },
    onSuccess: async (newDashboard) => {
      await queryClient.invalidateQueries(['dashboards', 'summaries']);

      setNotifications((prevNotifications) => {
        return [
          ...prevNotifications,
          {
            id: newDashboard.id,
            type: 'success',
            content: 'Dashboard created successfully.',
            dismissible: true,
            onDismiss: () => {
              setNotifications((prev) => {
                return prev.filter((n) => n.id !== newDashboard.id);
              });
            },
          },
        ];
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
    <Layout
      activeHref="/dashboards"
      crumbs={[
        { text: messages.appName, href: '/' },
        { text: messages.dashboards, href: '/dashboards' },
        {
          text: messages.createDashboard,
          href: `/dashboards/new`,
        },
      ]}
      type="form"
    >
      <ContentLayout header={<Header variant="h1">Create dashboard</Header>}>
        <ControlledForm
          defaultValues={{
            name: '',
            description: '',
          }}
          variant="full-page"
          errorText={getErrorText()}
          onSubmit={(formData) => {
            createDashboardMutation.mutate({
              ...formData,
              isFavorite: false,
              definition: { widgets: [] },
            });
          }}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => navigate(-1)}>{messages.cancel}</Button>

              <Button
                variant="primary"
                formAction="submit"
                loading={createDashboardMutation.isLoading}
              >
                {messages.createDashboard}
              </Button>
            </SpaceBetween>
          }
        >
          <Container>
            <SpaceBetween size="l">
              <ControlledForm.Input
                name="name"
                autoFocus
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
                placeholder="Dashboard name"
                label="Dashboard name"
                description="Enter the name you want to give to your dashboard."
                constraintText={`Name must be between
                    ${$Dashboard.properties.name.minLength} and
                    ${$Dashboard.properties.name.maxLength} characters.`}
              />

              <ControlledForm.Textarea
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
                label="Dashboard description"
                description="Enter the description for your dashboard."
                constraintText={`Descriptions must be between ${$Dashboard.properties.description.minLength} and
                    ${$Dashboard.properties.description.maxLength} characters.`}
                placeholder="Dashboard description"
              />
            </SpaceBetween>
          </Container>
        </ControlledForm>
      </ContentLayout>
    </Layout>
  );
}
