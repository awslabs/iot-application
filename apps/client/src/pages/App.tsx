import { useState } from 'react';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { Outlet } from 'react-router-dom';

export interface AppProps {
  signOut?: () => void;
}

const App: React.FC<AppProps> = ({ signOut }) => {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup items={[{ text: 'Dashboards', href: '/' }]} />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                signOut && (
                  <Button key={'signout'} onClick={signOut}>
                    Sign out
                  </Button>
                )
              }
            >
              IoT Application
            </Header>
          }
        >
          <Outlet />
        </ContentLayout>
      }
      navigation={
        <SideNavigation
          header={{ href: '/dashboards', text: 'IoT Application' }}
          items={[
            {
              type: 'link',
              text: 'Dashboards',
              href: '/dashboards',
            },
            { type: 'divider' },
          ]}
        />
      }
      navigationOpen={navigationOpen}
      onNavigationChange={(e) => setNavigationOpen(e.detail.open)}
      toolsHide={true}
    />
  );
};

export default App;
