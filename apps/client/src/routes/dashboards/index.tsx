import messages from '../../assets/messages';

import { Layout } from 'src/components';
import { DashboardCollection } from 'src/components/dashboard-collection/dashboard-collection';

export const DASHBOARDS_INDEX_ROUTE = {
  index: true,
  element: <DashboardsIndexPage />,
};

export function DashboardsIndexPage() {
  return (
    <>
      <Layout
        activeHref="/dashboards"
        crumbs={[
          { text: messages.appName, href: '/' },
          { text: messages.dashboards, href: '/dashboards' },
        ]}
        type="table"
      >
        <DashboardCollection type="table" onlyFavorites={false} />
      </Layout>
    </>
  );
}
