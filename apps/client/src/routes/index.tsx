import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Flashbar,
  Header,
} from '@cloudscape-design/components';
import messages from '../assets/messages';
import { Navigation } from './components/navigation/navigation';
import { useNotifications } from './hooks/use-notifications';
import { useState } from 'react';

export const INDEX_ROUTE = {
  index: true,
  element: <IndexPage />,
};

export function IndexPage() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  const { notifications } = useNotifications();

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup items={[{ text: messages.appName, href: '/' }]} />
      }
      content={
        <ContentLayout header={<Header variant="h1">Home</Header>}>
          <Container
            header={<Header variant="h2">Your favorites</Header>}
          ></Container>
        </ContentLayout>
      }
      notifications={<Flashbar items={notifications} stackItems={true} />}
      navigation={<Navigation activeHref="/" />}
      navigationOpen={navigationOpen}
      onNavigationChange={() => setNavigationOpen((open) => !open)}
      toolsHide={true}
    />
  );
}
