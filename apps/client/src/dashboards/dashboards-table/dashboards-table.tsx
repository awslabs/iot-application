import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import messages from '../../assets/messages';

import type { Dashboard, DashboardSummary } from '../../services';
import { Empty, NoMatch } from './table-states';

const getCountText = (count: number) =>
  count === 1 ? messages.match : `${count} ${messages.matches}`;

const OPTIONS = {
  SELECTION_TYPE: 'single',
  VARIANT: 'full-page',
} as const;

interface Props {
  dashboards: DashboardSummary[];
  onCreateDashboard: () => void;
  onUpdateDashboard: (
    partialDashboard: { id: string } & Partial<Dashboard>,
  ) => void;
  onDeleteDashboard: (id: string) => void;
  isLoading: boolean;
}

export const DashboardsTable: React.FC<Props> = ({
  dashboards,
  isLoading,
  onCreateDashboard,
  onUpdateDashboard,
  onDeleteDashboard,
}) => {
  const [preferences, setPreferences] = useState({ pageSize: 10 });
  const {
    actions,
    collectionProps,
    filteredItemsCount = 0,
    filterProps,
    items,
    paginationProps,
  } = useCollection(dashboards, {
    filtering: {
      empty: <Empty onClick={onCreateDashboard} />,
      noMatch: <NoMatch onClick={() => actions.setFiltering('')} />,
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {},
    sorting: {},
  });

  const { selectedItems = [] } = collectionProps;
  const selectedDashboard = selectedItems.at(0);
  const isDeleteDisabled = !selectedDashboard;

  const onClickDelete = () => {
    if (selectedDashboard) {
      onDeleteDashboard(selectedDashboard.id);
    }
  };

  return (
    <Table
      {...collectionProps}
      submitEdit={onUpdateDashboard}
      selectionType={OPTIONS.SELECTION_TYPE}
      header={
        <Header
          variant="h1"
          actions={
            <>
              <Button onClick={onCreateDashboard} variant="primary">
                {messages.create}
              </Button>

              <Button onClick={onClickDelete} disabled={isDeleteDisabled}>
                {messages.delete}
              </Button>
            </>
          }
        >
          {messages.dashboards}
        </Header>
      }
      columnDefinitions={[
        {
          id: 'name',
          header: messages.name,
          cell: (d: DashboardSummary) => (
            <Link to={`/dashboards/${d.id}`}>{d.name}</Link>
          ),
          sortingField: 'name',
        },
        {
          id: 'description',
          header: messages.description,
          cell: (d: DashboardSummary) => d.description,
        },
      ]}
      filter={
        <TextFilter
          countText={getCountText(filteredItemsCount)}
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
      variant={OPTIONS.VARIANT}
      loading={isLoading}
      loadingText={messages.loading}
      resizableColumns
    />
  );
};
