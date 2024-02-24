import { useState } from 'react';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { authService } from '../../auth/auth-service';
import { PropsWithChildren } from 'react';
import { useEdgeLoginQuery } from './hooks/use-edge-login-query';

// Define an empty type to use PropsWithChildren<EdgeLoginProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EdgeLoginProps {}

export function EdgeLoginPage({ children }: PropsWithChildren<EdgeLoginProps>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMechanism, setAuthMechanism] = useState({
    label: 'Linux',
    value: 'linux',
  });
  const [error, setError] = useState('');
  const { refetch } = useEdgeLoginQuery({
    edgeEndpoint: ipAddress,
    username,
    password,
    authMechanism: authMechanism.value,
  });

  const getCredentials = async () => {
    const { data } = await refetch();
    if (data) {
      authService.setAwsCredentials(data);
      setIsLoggedIn(true);
    } else {
      setError('Error logging in');
    }
  };
  if (isLoggedIn) {
    return children;
  } else {
    return (
      <ColumnLayout columns={3}>
        <div></div>
        <Box margin="xxxl">
          <form onSubmit={(e) => e.preventDefault()}>
            <Form
              actions={
                <Button
                  variant="primary"
                  className="btn-custom-primary"
                  onClick={() => void getCredentials()}
                >
                  <span style={{ color: colorBackgroundHomeHeader }}>
                    Sign in
                  </span>
                </Button>
              }
              errorText={error}
            >
              <Container
                header={<Header variant="h2">Sign in to edge gateway</Header>}
              >
                <SpaceBetween direction="vertical" size="l">
                  <FormField
                    label="Hostname or IP address"
                    description="The hostname or IP adddress of the gateway device."
                  >
                    <Input
                      ariaLabel="Enter hostname or IP address"
                      onChange={({ detail }) => setIpAddress(detail.value)}
                      value={ipAddress}
                      placeholder="Enter hostname or IP address"
                    />
                  </FormField>
                  <FormField
                    label="Authentication type"
                    description="You can authenticate to this gateway with your Operating System Authentication or Lightweight Directory Access Protocol (LDAP) credentials."
                  >
                    <Select
                      ariaLabel="Select an authentication type"
                      onChange={({ detail }) =>
                        setAuthMechanism({
                          label: detail.selectedOption.label
                            ? detail.selectedOption.label
                            : '',
                          value: detail.selectedOption.value
                            ? detail.selectedOption.value
                            : '',
                        })
                      }
                      selectedOption={authMechanism}
                      options={[
                        { label: 'Linux', value: 'linux' },
                        { label: 'LDAP', value: 'ldap' },
                      ]}
                    />
                  </FormField>
                  <FormField
                    label="Username"
                    description="The user name of your operating system or LDAP."
                  >
                    <Input
                      ariaLabel="Enter username"
                      onChange={({ detail }) => setUsername(detail.value)}
                      value={username}
                      placeholder="Enter username"
                    />
                  </FormField>
                  <FormField
                    label="Password"
                    description="The password of your operating system or LDAP user."
                  >
                    <Input
                      ariaLabel="Enter password"
                      onChange={({ detail }) => setPassword(detail.value)}
                      value={password}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormField>
                </SpaceBetween>
              </Container>
            </Form>
          </form>
        </Box>
        <div></div>
      </ColumnLayout>
    );
  }
}
