import AppLayout from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useDashboardQuery, useDeleteDashboardMutation } from './hooks/hooks';
import {
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Flashbar,
  Header,
  SegmentedControl,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { Navigation } from '../components/navigation/navigation';
import messages from 'src/assets/messages';
import { useNotifications } from '../hooks/use-notifications';
import { DeleteModal } from './components/delete-modal/delete-modal';
import { useIsFetching } from '@tanstack/react-query';

export const DASHBOARD_ROUTE = {
  path: ':dashboardId',
  element: <DashboardPage />,
};

type Mode = 'view' | 'edit';

export function DashboardPage() {
  const { dashboardId } = useParams<'dashboardId'>();
  const dashboard = useDashboardQuery(dashboardId);
  const deleteDashboardMutation = useDeleteDashboardMutation();
  const { notifications } = useNotifications();
  const [mode, setMode] = useState<Mode>('view');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const navigate = useNavigate();
  const isFetching = useIsFetching();

  if (deleteDashboardMutation.isSuccess && !isFetching) {
    return <Navigate to="/dashboards" />;
  }

  return (
    <>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: messages.appName, href: '/' },
              { text: messages.dashboards, href: '/dashboards' },
              {
                text: dashboard.data?.name ?? 'Loading...',
                href: `/dashboards/${dashboard.data?.id ?? ''}`,
              },
            ]}
            onFollow={(event) => {
              event.preventDefault();
              navigate(event.detail.href);
            }}
          />
        }
        contentType="dashboard"
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                description={
                  dashboard.data?.description ?? 'Loading description...'
                }
                actions={
                  <SpaceBetween direction="horizontal" size="m">
                    <SegmentedControl
                      selectedId={mode}
                      onChange={({ detail }) =>
                        setMode(detail.selectedId as Mode)
                      }
                      options={[
                        { text: 'View', id: 'view' },
                        { text: 'Edit', id: 'edit' },
                      ]}
                    />

                    <Button onClick={() => setShowDeleteModal(true)}>
                      Delete
                    </Button>
                  </SpaceBetween>
                }
              >
                {dashboard.data?.name ?? 'Loading...'}
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2">
                  {mode === 'edit' ? 'Editing' : 'Viewing'}
                </Header>
              }
            ></Container>
          </ContentLayout>
        }
        notifications={<Flashbar items={notifications} stackItems={true} />}
        navigation={<Navigation activeHref="/dashboards" />}
        onNavigationChange={() => setNavigationOpen((open) => !open)}
        navigationOpen={navigationOpen}
        toolsHide={true}
      />

      <DeleteModal
        visible={showDeleteModal}
        onDiscard={() => setShowDeleteModal(false)}
        onDelete={() => {
          if (dashboard.data?.id) {
            deleteDashboardMutation.mutate(dashboard.data.id);
          }

          return;
        }}
        name={dashboard.data?.name ?? 'Loading...'}
        isLoading={deleteDashboardMutation.isLoading}
      />
    </>
  );

  /*
  const { dashboardId } = useParams<'dashboardId'>();

  invariant(dashboardId, 'Expected dashboardId to be defined.');

  const dashboard = useDashboardQuery(dashboardId);

  if (dashboard.isSuccess) {
    return <h1>dashboard view for {dashboard.data.id}</h1>;
  }

  if (dashboard.isLoading) {
    return <div>spinner</div>;
  }

  if (dashboard.error instanceof Error) {
    invariant(false, dashboard.error.message);
  }

  invariant(false, `Unexpected error at /dashboards/${dashboardId}`);
  */
}
