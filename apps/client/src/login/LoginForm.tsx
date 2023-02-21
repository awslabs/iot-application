import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import AppLayout from '@cloudscape-design/components/app-layout';
import { Outlet } from 'react-router-dom';
import { Form, FormField, Input } from '@cloudscape-design/components';
import { LoginFormProps } from './types';

const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit }) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <AppLayout
      content={
        <SpaceBetween size="s">
          <Header variant="h1">IoT Application Login</Header>
          <form onSubmit={handleSubmit}>
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="primary">Submit</Button>
                </SpaceBetween>
              }
            >
              <FormField label="Username">
                <Input
                  value={userName}
                  onChange={(event) => setUserName(event.detail.value)}
                />
              </FormField>
              <FormField label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.detail.value)}
                />
              </FormField>
            </Form>
          </form>

          <Outlet />
        </SpaceBetween>
      }
      navigationHide={true}
      toolsHide={true}
    />
  );
};

export default LoginForm;
