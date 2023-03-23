import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import { FormattedMessage, useIntl } from 'react-intl';
import { createBrowserRouter } from 'react-router-dom';

import { DASHBOARDS_INDEX_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARDS_QUERY } from '~/data/dashboards';

import { useQuery } from '@tanstack/react-query';

export const route = {
  index: true,
  element: <DashboardsIndexPage />,
  handle: {
    format: DASHBOARDS_INDEX_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];

export function DashboardsIndexPage() {
  const intl = useIntl();
  const dashboardsQuery = useQuery(DASHBOARDS_QUERY);

  return (
    <Table
      variant="full-page"
      items={dashboardsQuery.data ?? []}
      loading={dashboardsQuery.isLoading}
      header={
        <Header variant="h1">
          <FormattedMessage
            defaultMessage="Dashboards"
            description="dashboards page header"
          />
        </Header>
      }
      columnDefinitions={[
        {
          id: 'name',
          header: intl.formatMessage({
            defaultMessage: 'Name',
            description: 'dashboards table dashboard name column header',
          }),
          cell: (d) => d.name,
        },
        {
          id: 'description',
          header: intl.formatMessage({
            defaultMessage: 'Description',
            description: 'dashboards table dashboard description column header',
          }),
          cell: (d) => d.description,
        },
      ]}
    />
  );
}
