import { useCollection } from '@cloudscape-design/collection-hooks';
import Pagination from '@cloudscape-design/components/pagination';

import { useDashboardsQuery } from './use-dashboards-query';
import { useTablePreferences } from './use-table-preferences';
import { EmptyDashboardsTable } from '../components/empty-dashboards-table';
import { NoMatchDashboardsTable } from '../components/no-matches-dashboards-table';
import { DashboardsTableFilter } from '../components/dashboards-table-filter';
import { DashboardsTablePreferences } from '../components/dashboards-table-preferences';

import type { TableProps } from '@cloudscape-design/components/table';

export function useDashboardsTable() {
  const [preferences, setPreferences] = useTablePreferences();
  const dashboardsQuery = useDashboardsQuery();

  const {
    actions,
    collectionProps,
    filterProps,
    filteredItemsCount = 0,
    items,
    paginationProps,
  } = useCollection(dashboardsQuery.data ?? [], {
    filtering: {
      empty: <EmptyDashboardsTable />,
      noMatch: (
        <NoMatchDashboardsTable onClick={() => actions.setFiltering('')} />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {},
    sorting: {},
  });

  const { selectedItems = [] } = collectionProps;

  return {
    selectedItems,
    tableProps: {
      ...collectionProps,
      variant: 'full-page',
      items,
      resizableColumns: true,
      stickyHeader: true,
      selectionType: 'multi',
      stripedRows: preferences.stripedRows,
      wrapLines: preferences.wrapLines,
      visibleColumns: preferences.visibleContent,
      loading: dashboardsQuery.isLoading,
      filter: (
        <DashboardsTableFilter {...filterProps} count={filteredItemsCount} />
      ),
      pagination: <Pagination {...paginationProps} />,
      preferences: (
        <DashboardsTablePreferences
          onConfirm={(event) =>
            setPreferences(event.detail as typeof preferences)
          }
          preferences={preferences}
        />
      ),
    } as const satisfies Omit<TableProps, 'columnDefinitions'>,
  };
}
