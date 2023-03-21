import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import { FormattedMessage, useIntl } from 'react-intl';
import { createBrowserRouter, useLoaderData } from 'react-router-dom';

import { DASHBOARDS_INDEX_PAGE_FORMAT } from '~/constants/format';
import { DASHBOARDS_QUERY } from '~/data/dashboards';
import { queryClient } from '~/data/query-client';

import type { AsyncReturnType } from 'type-fest';

export const route = {
  index: true,
  element: <DashboardsIndexPage />,
  loader: () => {
    return queryClient.ensureQueryData(DASHBOARDS_QUERY);
  },
  handle: {
    format: DASHBOARDS_INDEX_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];

export function DashboardsIndexPage() {
  const dashboards = useLoaderData() as AsyncReturnType<typeof route.loader>;
  const intl = useIntl();

  return (
    <Table
      variant="full-page"
      items={dashboards}
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
          cell: (d) => d.id,
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
