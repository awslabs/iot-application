import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Form,
  ContentLayout,
  SpaceBetween,
  Container,
  FormField,
  Input,
  Header,
} from '@cloudscape-design/components';
import { Navigation } from '../components/navigation/navigation';
import messages from '../../assets/messages';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDashboardMutation } from './hooks/hooks';

export const NEW_DASHBOARD_ROUTE = {
  path: 'new',
  element: <NewDashboardPage />,
};

export function NewDashboardPage() {
  const [dashboardName, setDashboardName] = useState('Default name');
  const [dashboardDescription, setDashboardDescription] =
    useState('Description');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const createDashboardMutation = useCreateDashboardMutation();
  const navigate = useNavigate();
  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: messages.appName, href: '/' },
            { text: messages.dashboards, href: '/dashboards' },
            {
              text: messages.createDashboard,
              href: `/dashboards/new`,
            },
          ]}
        />
      }
      contentType="form"
      content={
        <ContentLayout header={<Header variant="h1">Create dashboard</Header>}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => navigate(-1)}>
                    {messages.cancel}
                  </Button>

                  <Button
                    onClick={() =>
                      createDashboardMutation.mutate(
                        {
                          name: dashboardName,
                          description: dashboardDescription,
                          definition: {
                            widgets: [],
                          },
                        },
                        {
                          onSuccess: (data) => {
                            navigate(`/dashboards/${data.id}`);
                          },
                        },
                      )
                    }
                    variant="primary"
                    loading={createDashboardMutation.isLoading}
                  >
                    {messages.createDashboard}
                  </Button>
                </SpaceBetween>
              }
            >
              <Container>
                <SpaceBetween size="l">
                  <FormField
                    label="Dashboard name"
                    description="Enter the name you want to give to your dashboard."
                  >
                    <Input
                      ariaRequired={true}
                      value={dashboardName}
                      placeholder="Dashboard name"
                      onChange={({ detail: { value } }) =>
                        setDashboardName(value)
                      }
                    />
                  </FormField>

                  <FormField
                    label="Dashboard description"
                    description="Enter the description for your dashboard."
                  >
                    <Input
                      ariaRequired={true}
                      value={dashboardDescription}
                      onChange={({ detail: { value } }) =>
                        setDashboardDescription(value)
                      }
                    />
                  </FormField>
                </SpaceBetween>
              </Container>
            </Form>
          </form>
        </ContentLayout>
      }
      navigation={<Navigation activeHref="/dashboards" />}
      navigationOpen={navigationOpen}
      onNavigationChange={() => setNavigationOpen((open) => !open)}
    />
  );
}
