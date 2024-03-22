import { useState } from 'react';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { DevTool } from '@hookform/devtools';
import { authService } from '../../auth/auth-service';
import { useEdgeLoginForm } from './hooks/use-edge-login-form';
import { EdgeUsernameField } from './components/edge-username-field';
import { EdgeMechanismField } from './components/edge-mechanism-field';
import { EdgePasswordField } from './components/edge-password-field';
import { edgeLogin } from '~/services';
import { ApiError } from '~/services/generated/core/ApiError';
import { useApplication } from '~/hooks/application/use-application';

// Adding type since ApiError types body as any
interface ApiErrorBody {
  message: string;
}

export function EdgeLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { control, handleSubmit } = useEdgeLoginForm();
  const { navigate } = useApplication();

  const isProdEnv: boolean = process.env.NODE_ENV === 'production';

  return (
    <ColumnLayout columns={3}>
      <div />
      <Box margin="xxxl">
        <form
          onSubmit={(event) => {
            event.preventDefault();

            void handleSubmit(async (formData) => {
              try {
                setIsLoading(true);
                const data = await edgeLogin(formData);
                authService.setAwsCredentials(data);
                setIsLoading(false);
                navigate('/dashboards');
              } catch (error) {
                if (error instanceof ApiError) {
                  const errorBody = error.body as ApiErrorBody;
                  setError(errorBody.message);
                } else {
                  setError('Error logging in.');
                }
                setIsLoading(false);
              }
            })();
          }}
        >
          <Form
            actions={
              <Button
                formAction="submit"
                variant="primary"
                className="btn-custom-primary"
                loading={isLoading}
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
                <EdgeMechanismField control={control} />
                <EdgeUsernameField control={control} />
                <EdgePasswordField control={control} />
              </SpaceBetween>
            </Container>
          </Form>
        </form>
        {!isProdEnv && <DevTool control={control} />}
      </Box>
      <div />
    </ColumnLayout>
  );
}
