import AppLayout from '@cloudscape-design/components/app-layout';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Flashbar from '@cloudscape-design/components/flashbar';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { Navigation } from '../components/navigation/navigation';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  useDashboardsQuery,
  useDeleteDashboardMutation,
  usePartialUpdateDashboardMutation,
} from './hooks/hooks';
import messages from '../../assets/messages';

import { DeleteModal } from './components/delete-modal/delete-modal';
import { useNotifications } from '../hooks/use-notifications';
import { Input, SpaceBetween } from '@cloudscape-design/components';

export const DASHBOARDS_INDEX_ROUTE = {
  index: true,
  element: <DashboardsIndexPage />,
};

export function DashboardsIndexPage() {
  const updateDashboardMutation = usePartialUpdateDashboardMutation();
  const deleteDashboardMutation = useDeleteDashboardMutation();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { notifications } = useNotifications();
  const [navigationOpen, setNavigationOpen] = useState(false);

  const dashboards = useDashboardsQuery();

  const [preferences, setPreferences] = useState({ pageSize: 10 });
  const {
    actions,
    collectionProps,
    filteredItemsCount = 0,
    filterProps,
    items,
    paginationProps,
  } = useCollection(dashboards.data ?? [], {
    filtering: {
      empty: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            {messages.noDashboards}
          </Box>

          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            {messages.noDashboards2}
          </Box>

          <Button onClick={() => navigate('/dashboards/new')}>
            {messages.createDashboard}
          </Button>
        </Box>
      ),
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            {messages.noMatches}
          </Box>

          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            {messages.noMatches2}
          </Box>

          <Button onClick={() => actions.setFiltering('')}>
            {messages.clear}
          </Button>
        </Box>
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {},
    sorting: {},
  });

  const { selectedItems = [] } = collectionProps;
  const selectedDashboard = selectedItems.at(0);

  return (
    <>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: messages.appName, href: '/' },
              { text: messages.dashboards, href: '/dashboards' },
            ]}
            onFollow={(event) => {
              event.preventDefault();
              navigate(event.detail.href);
            }}
          />
        }
        contentType="table"
        content={
          <Table
            {...collectionProps}
            submitEdit={async (item, column, newValue) => {
              console.log(item);
              console.log(column);
              await updateDashboardMutation.mutateAsync({
                id: item.id,
                [column.id as string]: newValue,
              });
            }}
            selectionType="single"
            selectedItems={selectedItems}
            stickyHeader={true}
            header={
              <Header
                variant="h1"
                description={`
                  Manage your dashboards or select one to begin monitoring your live industrial data.
                `}
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/dashboards/new')}
                    >
                      {messages.create}
                    </Button>

                    <Button
                      onClick={() => {
                        if (selectedDashboard) {
                          setShowDeleteModal(true);
                        }
                      }}
                      disabled={!selectedDashboard}
                    >
                      {messages.delete}
                    </Button>
                  </SpaceBetween>
                }
              >
                {messages.dashboards}
              </Header>
            }
            columnDefinitions={[
              {
                id: 'name',
                header: messages.name,
                cell: (d) => <Link to={`/dashboards/${d.id}`}>{d.name}</Link>,
                sortingField: 'name',
                editConfig: {
                  ariaLabel: 'Name',
                  editIconAriaLabel: 'editable',
                  errorIconAriaLabel: 'Name Error',
                  editingCell: (
                    dashboard,
                    {
                      currentValue,
                      setValue,
                    }: {
                      currentValue?: string;
                      setValue: (name: string) => void;
                    },
                  ) => {
                    const value = currentValue ?? dashboard.name;

                    return (
                      <Input
                        autoFocus={true}
                        placeholder="Enter dashboard name"
                        value={value}
                        onChange={(event) => {
                          setValue(event.detail.value);
                        }}
                      />
                    );
                  },
                },
              },
              {
                id: 'description',
                header: messages.description,
                cell: (d) => d.description,
                sortingField: 'description',
                editConfig: {
                  ariaLabel: 'Description',
                  editIconAriaLabel: 'editable',
                  errorIconAriaLabel: 'Description Error',
                  editingCell: (
                    dashboard,
                    {
                      currentValue,
                      setValue,
                    }: {
                      currentValue?: string;
                      setValue: (name: string) => void;
                    },
                  ) => {
                    const value = currentValue ?? dashboard.description;

                    return (
                      <Input
                        autoFocus={true}
                        placeholder="Enter dashboard description"
                        value={value}
                        onChange={(event) => {
                          setValue(event.detail.value);
                        }}
                      />
                    );
                  },
                },
              },
            ]}
            filter={
              <TextFilter
                countText={
                  filteredItemsCount === 1
                    ? messages.match
                    : `${filteredItemsCount} ${messages.matches}`
                }
                filteringPlaceholder={messages.findDashboards}
                filteringText={filterProps.filteringText}
                onChange={filterProps.onChange.bind(filterProps)}
              />
            }
            pagination={<Pagination {...paginationProps} />}
            preferences={
              <CollectionPreferences
                title={messages.preferences}
                confirmLabel={messages.confirm}
                cancelLabel={messages.cancel}
                onConfirm={({ detail }) =>
                  setPreferences(detail as typeof preferences)
                }
                preferences={preferences}
                pageSizePreference={{
                  title: messages.pageSize,
                  options: [
                    {
                      value: 10,
                      label: `10 ${messages.dashboards2}`,
                    },
                    {
                      value: 25,
                      label: `25 ${messages.dashboards2}`,
                    },
                    {
                      value: 100,
                      label: `100 ${messages.dashboards2}`,
                    },
                  ],
                }}
              />
            }
            items={items}
            variant="full-page"
            loading={dashboards.isLoading}
            loadingText={messages.loading}
            resizableColumns
          />
        }
        notifications={<Flashbar items={notifications} stackItems={true} />}
        navigation={<Navigation activeHref="/dashboards" />}
        navigationOpen={navigationOpen}
        onNavigationChange={() => setNavigationOpen((open) => !open)}
        toolsHide={true}
      />

      <DeleteModal
        visible={showDeleteModal}
        onDiscard={() => setShowDeleteModal(false)}
        onDelete={() => {
          if (selectedDashboard) {
            deleteDashboardMutation.mutate(selectedDashboard.id, {
              onSuccess: () => {
                setShowDeleteModal(false);
              },
            });
          }
        }}
        name={selectedDashboard?.name ?? 'Loading...'}
        isLoading={deleteDashboardMutation.isLoading}
      />
    </>
  );
}
