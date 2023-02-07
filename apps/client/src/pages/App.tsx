import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import AppLayout from '@cloudscape-design/components/app-layout';
import { SignOut } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router-dom';

export interface AppProps {
  signOut?: SignOut;
}

const App: React.FC<AppProps> = ({ signOut }) => {
  return (
    <AppLayout
      content={
        <SpaceBetween size='s'>
          <Header
            variant='h1'
            actions={
              signOut && <Button key={'signout'} onClick={signOut}>Sign out</Button>
            }
          >IoT Application</Header>

          <Outlet/>
        </SpaceBetween>
      }
      navigationHide={true}
      toolsHide={true}
    />
  );
}

export default App;
