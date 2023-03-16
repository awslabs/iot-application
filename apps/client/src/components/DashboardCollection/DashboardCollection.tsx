import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Cards from '@cloudscape-design/components/cards';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter, {
  TextFilterProps,
} from '@cloudscape-design/components/text-filter';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DeleteDashboardModal } from 'src/components';
import { useSendNotification } from 'src/layout/components/Notifications';

import { useQueryClient } from '@tanstack/react-query';

import messages from 'src/assets/messages';

import {
  useCreateDashboardMutation,
  usePartialUpdateDashboardMutation,
} from 'src/routes/dashboards/hooks/hooks';
import { Icon } from '@cloudscape-design/components';
import { DashboardSummary, readDashboard } from 'src/services';
import invariant from 'tiny-invariant';

export interface Props {
  dashboards: DashboardSummary[];
  onlyFavorites: boolean;
  type: 'table' | 'cards';
}

const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  visibleContent: ['name', 'description', 'favorite', 'lastUpdateDate'],
} as const;

export function DashboardCollection(props: Props) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const updateDashboardMutation = usePartialUpdateDashboardMutation();
  const createDashboardMutation = useCreateDashboardMutation();

  const sendNotification = useSendNotification();

  const queryClient = useQueryClient();

  const {
    actions,
    collectionProps,
    items,
    paginationProps,
    filterProps,
    filteredItemsCount = 0,
  } = useCollection(props.dashboards, {
    filtering: {
      empty: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            {props.onlyFavorites ? 'No favorite dashboards' : 'No dashboards'}
          </Box>

          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            {props.onlyFavorites
              ? 'No favorite dashboards to display'
              : 'No dashboards to display'}
          </Box>

          <Button
            onClick={() => {
              if (props.onlyFavorites) {
                navigate('/dashboards');
              } else {
                navigate('/dashboards/create');
              }
            }}
          >
            {props.onlyFavorites ? 'Select favorites' : 'Create dashboard'}
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

  const configProps = {
    ...collectionProps,
    items,
    selectionType: 'multi' as const,
    stickyHeader: true,
    variant: 'full-page' as const,
    filter: <Filter {...filterProps} filteredItemsCount={filteredItemsCount} />,
    pagination: <Pagination {...paginationProps} />,
  };

  return (
    <>
      {props.type === 'cards' ? (
        <Cards
          {...configProps}
          visibleSections={preferences.visibleContent}
          preferences={
            <CollectionPreferences
              title={messages.preferences}
              confirmLabel={messages.confirm}
              cancelLabel={messages.cancel}
              onConfirm={({ detail }) => {
                setPreferences(detail as typeof preferences);
              }}
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
              visibleContentPreference={{
                title: 'Select visible content',
                options: [
                  {
                    label: 'Dashboard properites',
                    options: [
                      {
                        id: 'dashboard-id',
                        label: 'Dashboard ID',
                      },
                      { id: 'name', label: 'Dashboard name', editable: false },
                      {
                        id: 'description',
                        label: 'Dashboard description',
                      },
                      {
                        id: 'favorite',
                        label: 'Favorite',
                      },
                      {
                        id: 'lastUpdateDate',
                        label: 'Last update date',
                      },
                      {
                        id: 'creationDate',
                        label: 'Creation date',
                      },
                    ],
                  },
                ],
              }}
            />
          }
          header={
            <CollectionHeader
              selectedDashboards={[...selectedItems]}
              isCopyLoading={createDashboardMutation.isLoading}
              isFavoriteLoading={updateDashboardMutation.isLoading}
              onCopy={() => {
                void Promise.allSettled(
                  selectedItems.map(async ({ id }) => {
                    const dashboard = await readDashboard(id);
                    await createDashboardMutation.mutateAsync({
                      ...dashboard,
                      name: `${dashboard.name} copy`,
                    });
                  }),
                ).then(async () => {
                  await queryClient.invalidateQueries([
                    'dashboards',
                    'summaries',
                  ]);

                  sendNotification({
                    id: 'copy completed',
                    type: 'success',
                    content: 'Dashboards copied successfully.',
                  });
                });
              }}
              onFavorite={() => {
                void Promise.all(
                  selectedItems.map((dashboard) =>
                    updateDashboardMutation.mutateAsync({
                      ...dashboard,
                      isFavorite: !dashboard.isFavorite,
                    }),
                  ),
                ).then(async () => {
                  await queryClient.invalidateQueries([
                    'dashboards',
                    'summaries',
                  ]);

                  sendNotification({
                    id: 'favorite completed',
                    type: 'success',
                    content: 'Dashboards updated successfully.',
                  });
                });
              }}
              heading="Favorites"
              description="Your favorite dashboards, all in one place."
            >
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete
              </Button>
            </CollectionHeader>
          }
          cardDefinition={{
            header: (dashboard) => (
              <Link to={`/dashboards/${dashboard.id}`}>{dashboard.name}</Link>
            ),
            sections: [
              {
                id: 'dashboard-id',
                header: 'Dashboard ID',
                content: (dashboard) => dashboard.id,
              },
              {
                id: 'description',
                header: 'Description',
                content: (dashboard) => dashboard.description,
              },
              {
                id: 'favorite',
                header: 'Favorite',
                content: (dashboard) => {
                  return (
                    <Icon
                      name="heart"
                      variant={dashboard.isFavorite ? 'warning' : 'disabled'}
                    />
                  );
                },
              },
              {
                id: 'lastUpdateDate',
                header: 'Last update date',
                content: (dashboard) => dashboard.lastUpdateDate,
              },

              {
                id: 'creationDate',
                header: 'Creation date',
                content: (dashboard) => dashboard.creationDate,
              },
            ],
          }}
        />
      ) : (
        <Table
          {...configProps}
          resizableColumns
          wrapLines={preferences.wrapLines}
          stripedRows={preferences.stripedRows}
          visibleColumns={preferences.visibleContent}
          submitEdit={async (item, column, newValue) => {
            invariant(column.id, 'Expected column to be defined');

            await updateDashboardMutation.mutateAsync({
              id: item.id,
              [column.id]: newValue,
            });
          }}
          header={
            <CollectionHeader
              isCopyLoading={createDashboardMutation.isLoading}
              isFavoriteLoading={updateDashboardMutation.isLoading}
              selectedDashboards={[...selectedItems]}
              onCopy={() => {
                void Promise.allSettled(
                  selectedItems.map(async ({ id }) => {
                    const dashboard = await readDashboard(id);
                    await createDashboardMutation.mutateAsync({
                      ...dashboard,
                      name: `${dashboard.name} copy`,
                    });
                  }),
                ).then(async () => {
                  await queryClient.invalidateQueries([
                    'dashboards',
                    'summaries',
                  ]);

                  sendNotification({
                    id: 'copy completed',
                    type: 'success',
                    content: 'Dashboards copied successfully.',
                  });
                });
              }}
              onFavorite={() => {
                void Promise.all(
                  selectedItems.map((dashboard) =>
                    updateDashboardMutation.mutateAsync({
                      ...dashboard,
                      isFavorite: !dashboard.isFavorite,
                    }),
                  ),
                ).then(async () => {
                  await queryClient.invalidateQueries([
                    'dashboards',
                    'summaries',
                  ]);

                  sendNotification({
                    id: 'favorite completed',
                    type: 'success',
                    content: 'Dashboards updated successfully.',
                  });
                });
              }}
              heading={messages.dashboards}
              description={`
              Manage your dashboards or select one to begin monitoring your live industrial data.
                `}
            >
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete
              </Button>
            </CollectionHeader>
          }
          preferences={
            <CollectionPreferences
              title={messages.preferences}
              confirmLabel={messages.confirm}
              cancelLabel={messages.cancel}
              onConfirm={({ detail }) => {
                setPreferences(detail as typeof preferences);
              }}
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
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              visibleContentPreference={{
                title: 'Select visible content',
                options: [
                  {
                    label: 'Dashboard properites',
                    options: [
                      {
                        id: 'dashboard-id',
                        label: 'Dashboard ID',
                      },
                      { id: 'name', label: 'Dashboard name', editable: false },
                      {
                        id: 'description',
                        label: 'Dashboard description',
                      },
                      {
                        id: 'favorite',
                        label: 'Favorite',
                      },
                      {
                        id: 'lastUpdateDate',
                        label: 'Last update date',
                      },
                      {
                        id: 'creationDate',
                        label: 'Creation date',
                      },
                    ],
                  },
                ],
              }}
            />
          }
          columnDefinitions={[
            {
              id: 'dashboard-id',
              header: 'Dashboard ID',
              cell: (dashboard) => dashboard.id,
              sortingField: 'id',
            },
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
            {
              id: 'favorite',
              header: 'Favorite',
              cell: (d) => (
                <Icon
                  name="heart"
                  variant={d.isFavorite ? 'warning' : 'disabled'}
                />
              ),
              sortingField: 'favorite',
            },
            {
              id: 'lastUpdateDate',
              header: 'Last update date',
              cell: (dashboard) => dashboard.lastUpdateDate,
              sortingField: 'lastUpdateDate',
            },
            {
              id: 'creationDate',
              header: 'Creation date',
              cell: (dashboard) => dashboard.creationDate,
              sortingField: 'creationDate',
            },
          ]}
        />
      )}

      <DeleteDashboardModal
        dashboards={[...selectedItems]}
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      />
    </>
  );
}

function CollectionHeader({
  selectedDashboards,
  heading,
  description,
  children,
  onFavorite,
  onCopy,
  isCopyLoading,
  isFavoriteLoading,
}: {
  selectedDashboards: DashboardSummary[];
  heading: string;
  description: string;
  onFavorite: () => void;
  onCopy: () => void;
  isCopyLoading: boolean;
  isFavoriteLoading: boolean;
} & React.PropsWithChildren) {
  const navigate = useNavigate();

  const isCopyDisabled = selectedDashboards.length === 0;

  const isAllFavorites = selectedDashboards.every(
    (dashboard) => dashboard.isFavorite,
  );
  const isNoneFavorites = selectedDashboards.every(
    (dashboard) => !dashboard.isFavorite,
  );
  const isSame = isAllFavorites || isNoneFavorites;
  const isFavoriteDisabled = !isSame || selectedDashboards.length === 0;

  return (
    <Header
      variant="h1"
      description={description}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboards/create')}
          >
            {messages.create}
          </Button>

          <Button
            onClick={onCopy}
            disabled={isCopyDisabled}
            loading={isCopyLoading}
          >
            Copy
          </Button>

          <Button
            onClick={onFavorite}
            disabled={isFavoriteDisabled}
            loading={isFavoriteLoading}
          >
            Toggle favorite
          </Button>

          {children}
        </SpaceBetween>
      }
    >
      {heading}
    </Header>
  );
}

function Filter({
  filteredItemsCount,
  filteringText,
  onChange,
}: {
  filteredItemsCount: number;
  filteringText: TextFilterProps['filteringText'];
  onChange: TextFilterProps['onChange'];
}) {
  return (
    <TextFilter
      countText={
        filteredItemsCount === 1
          ? messages.match
          : `${filteredItemsCount} ${messages.matches}`
      }
      filteringPlaceholder={messages.findDashboards}
      filteringText={filteringText}
      onChange={onChange}
    />
  );
}
