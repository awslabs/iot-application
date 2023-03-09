import SpaceBetween from '@cloudscape-design/components/space-between';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboardQuery, useUpdateDashboardMutation } from './hooks/hooks';
import {
  Button,
  Container,
  ContentLayout,
  Header,
  Icon,
  SegmentedControl,
} from '@cloudscape-design/components';
import { useState } from 'react';

import messages from 'src/assets/messages';
import { useDeleteDashboard, Layout } from 'src/components';
import { queryClient } from 'src';
import invariant from 'tiny-invariant';

export const DASHBOARD_ROUTE = {
  path: ':dashboardId',
  element: <DashboardPage />,
};

type Mode = 'view' | 'edit';

export function DashboardPage() {
  const { dashboardId } = useParams<'dashboardId'>();
  const dashboard = useDashboardQuery(dashboardId);
  const [mode, setMode] = useState<Mode>('view');
  const navigate = useNavigate();

  const { DeleteDashboardButton, DeleteDashboardModal } = useDeleteDashboard({
    dashboards: dashboard.data ? [dashboard.data] : [],
    onSuccess: () => {
      navigate('/dashboards');
    },
  });

  const updateDashboardMutation = useUpdateDashboardMutation();

  return (
    <>
      <Layout
        activeHref="/"
        crumbs={[
          { text: messages.appName, href: '/' },
          { text: messages.dashboards, href: '/dashboards' },
          {
            text: dashboard.data?.name ?? 'Loading...',
            href: `/dashboards/${dashboard.data?.id ?? ''}`,
          },
        ]}
        type="dashboard"
      >
        <ContentLayout
          header={
            <Header
              variant="h1"
              description={
                dashboard.data?.description ?? 'Loading description...'
              }
              actions={
                <SpaceBetween direction="horizontal" size="m">
                  <Button
                    variant="icon"
                    iconSvg={
                      <Icon
                        name="heart"
                        variant={
                          dashboard.data?.isFavorite ? 'warning' : 'disabled'
                        }
                      />
                    }
                    onClick={() => {
                      invariant(
                        dashboard.data,
                        'Expected dashboard to be defined',
                      );
                      updateDashboardMutation.mutate(
                        {
                          ...dashboard.data,
                          isFavorite: !dashboard.data.isFavorite,
                        },
                        {
                          onSuccess: () => {
                            void queryClient.invalidateQueries([
                              'dashboards',
                              'summaries',
                            ]);
                          },
                        },
                      );
                    }}
                  />

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

                  <DeleteDashboardButton />
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
      </Layout>

      <DeleteDashboardModal />
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
