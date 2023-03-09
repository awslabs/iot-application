import messages from 'src/assets/messages';
import { Layout } from 'src/components';
import { DashboardCollection } from 'src/components/dashboard-collection/dashboard-collection';

export const INDEX_ROUTE = {
  index: true,
  element: <IndexPage />,
};

export function IndexPage() {
  return (
    <>
      <Layout
        activeHref="/"
        crumbs={[{ text: messages.appName, href: '/' }]}
        type="cards"
      >
        <DashboardCollection type="cards" onlyFavorites={true} />
      </Layout>
    </>
  );
}
